import { getCredentials } from "../services/credentials";
import axios from "axios";

export default class BackendAPI {

    constructor() {
        this.url = import.meta.env.VITE_BACKEND_URL;
    }

    call(method, path, data) {
        const headers = {"Authorization": `Bearer ${getCredentials()}`}
        return axios({ 
            method:  method, 
            url:     this.url + path, 
            data:    data,
            headers: headers
        });
    }

    setupMemberStack(key) {
        return this.call("POST", "/api/v1/setup/memberstack", {
            "key": key
        })
    }
    
    setupLndhub(url, username, password) {
        return this.call("POST", "/api/v1/setup/lndhub", {
            "url": url, 
            "username": username, 
            "password": password
        })
    }

    createQuiz(topic, prize, quizzes, redirect) {
        return this.call("POST", "/api/v1/quiz", {
            topic: topic,
            prize: prize,
            quizzes: quizzes,
            redirect: redirect
        });
    }

    getListQuizzes(page, size) {
        return this.call("GET", `/api/v1/quizzes?page=${page}&size=${size}`, {});
    }

    getQuiz(id) {
        return this.call("GET", `/api/v1/public/quiz/${id}`, {})
    }
    
    deleteQuiz(id) {
        return this.call("DELETE", `/api/v1/quiz/${id}`, {});
    }

    createReward(id, user, points) {
        return this.call("POST", `/api/v1/reward/${id}`, {
            user: user, points: points })
    }

    getBalance() {
        return this.call("GET", "/api/v1/balance", {})
    }

    createInvoice() {
        return this.call("POST", "/api/v1/invoice", {})
    }
}