import { Membership } from '../models/membership.model';
import { User } from '../models/user.model';

class MembershipService {
    async createMembership(userId: string, membershipData: any): Promise<Membership> {
        const membership = new Membership({
            userId,
            ...membershipData
        });
        return await membership.save();
    }

    async getMemberships(): Promise<Membership[]> {
        return await Membership.find();
    }

    async getMembershipById(membershipId: string): Promise<Membership | null> {
        return await Membership.findById(membershipId);
    }

    async updateMembership(membershipId: string, updateData: any): Promise<Membership | null> {
        return await Membership.findByIdAndUpdate(membershipId, updateData, { new: true });
    }

    async deleteMembership(membershipId: string): Promise<Membership | null> {
        return await Membership.findByIdAndDelete(membershipId);
    }

    async assignMembershipToUser(userId: string, membershipId: string): Promise<User | null> {
        const user = await User.findById(userId);
        if (user) {
            user.membershipId = membershipId;
            return await user.save();
        }
        return null;
    }
}

export default new MembershipService();