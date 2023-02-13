
export interface Source {
    path: string;
};

export const createSourceObject = (path: string): Source => {
    return { path };
}
