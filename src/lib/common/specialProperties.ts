import { PropertyTypeName } from "$lib/types/Item";

export const SPECIAL_PROPERTIES = [
    "#expire_date"
] as const;

export const isSpecialProperty = (property: string) => (SPECIAL_PROPERTIES as unknown as string[]).includes(property);

export const getSpecialPropertyType = (property: typeof SPECIAL_PROPERTIES[number]) => {
    switch (property) {
        case "#expire_date":
            return PropertyTypeName.DATE;
    }
}