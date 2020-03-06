import axios from 'axios';

export class CheckESN {
    private static url: string = 'http://134.209.34.48/';

    static async sendRequest(method: string, route: string, data: any) {
        const url = CheckESN.url + route;
        let response = await axios.post(url, JSON.stringify(data), {});
        return response && response.data ? response.data : '';
    }
}
