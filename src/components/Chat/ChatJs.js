import {ApiCall} from '@/ApiCall';

export default {
    data: () => ({
    }),
    mounted() {
        const api = new ApiCall();
        api.getUsers()
    },
    methods: {
    }
}

