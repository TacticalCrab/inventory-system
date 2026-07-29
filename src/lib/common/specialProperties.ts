import { PropertyTypeName } from "$lib/types/Item";

export enum SpecialPRoperties {
    EXPIRE_DATE = "#expire_date"
}

export const isSpecialProperty = (property: string) => (Object.values(SpecialPRoperties) as string[]).includes(property);

export const getSpecialPropertyType = (property: SpecialPRoperties) => {
    switch (property) {
        case "#expire_date":
            return PropertyTypeName.DATE;
    }
}