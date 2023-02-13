
export interface Source {
    path: string;
    content: string;
};

export const createSourceObject = (path: string, content: string): Source => {
    return { path, content };
}
