export interface Property {
    id?: number;
    name: string;
    value: string;
    typeName: string;
}

export interface Location {
    id: number;
    name: string;
}

export interface Item {
    id: number;
    name: string;
    barcode?: string | null;
    description?: string | null;
    properties?: Property[];
    categories?: string[];
    createdAt?: string | null;
    locations?: Location[];
}

export interface LocationItem extends Item {
    quantity?: number | null;
    unit?: string | null;
}