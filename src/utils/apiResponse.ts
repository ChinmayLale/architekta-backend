class ApiResponse {
    private status: number;
    private message: string;
    private data: any;
    private success: boolean;

    constructor(status: number, message: string, data: any, success: boolean = true) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}


export { ApiResponse }