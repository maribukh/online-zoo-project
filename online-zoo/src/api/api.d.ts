import type { IPet, IFeedback } from '../types';
export declare const API: {
    getPets: () => Promise<{
        data: IPet[];
    }>;
    getPetByID: (id: string) => Promise<IPet>;
    getFeedbacks: () => Promise<{
        data: IFeedback[];
    }>;
};
//# sourceMappingURL=api.d.ts.map