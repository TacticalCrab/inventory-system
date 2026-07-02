export interface Property {
    id?: number;
    name: string;
    value: string;
}

export interface Item {
    id: number;
    name: string;
    description?: string | null;
    properties?: Property[];
    categories?: string[];
    createdAt?: string | null;
}