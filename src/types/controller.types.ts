export interface CreateControllerInput {
    projectId: string;
    name: string;
    filename: string;
    modelId?: string;
    fieldName?: string;
    operationType: "FIND_ALL" | "FIND_BY_ID" | "CREATE" | "UPDATE" | "DELETE" | "FIND_BY_FIELD" | "SEARCH" | "COUNT" | "CUSTOM";
    config?: any;
}
