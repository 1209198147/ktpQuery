<template>
    <div style="width: 350px; margin: 250px auto; padding: 20px 80px 20px 10px; background-color: rgba(135,206,250, 0.1); border-radius: 8px; box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);">
        <div style="margin: 0 0 10px 85px; text-align: center; font-size: 36px; color: rgba(135,206,250, 0.5);">ktpQuery登入</div>
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="username">
                <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="下次自动登入" prop="autologin">
                <el-switch v-model="loginForm.autologin"></el-switch>
            </el-form-item> -->
        </el-form>
        <div>
            <el-button type="primary" style="width: 100px; margin: 0 0 0  150px;" @click="loginClicked">登入</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        var validateUsername = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请输入账号'))
            }else{
                callback()
            }
        }

        var validatePass = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请输入密码'))
            }else if(value.length < 6 || value.length > 30){
                callback(new Error('密码有效长度是6到30个字符'))
            }else{
                callback()
            }
        }
        return{
            loginForm:{
                username: '',
                password: '',
                // autologin: false
            },
            rules:{
                username:{
                    validator: validateUsername, trigger: 'blur'
                },
                password:{
                    validator: validatePass, trigger: 'blur'
                }
            }
        }
        
    },
    methods: {
        loginClicked(){
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    const data = JSON.stringify({
                        "email": this.loginForm.username,
                        "password": this.loginForm.password,
                        "remember": this.loginForm.autologin?"1":"0",
                        "code": "",
                        "mobile": "",
                        "type": "login",
                        "reqtimestamp": Date.now()
                    });

                    const p = axios.post("https://openapiv5.ketangpai.com//UserApi/login", data)
                    p.then(resp => {
                            if(resp.data.status == 1){
                                this.$token = resp.data.data.token
                                localStorage.setItem('token', resp.data.data.token)
                                // localStorage.setItem('autologin', this.loginForm.autologin)
                                this.$router.push('/ktpQuery')
                            }else{
                                this.$message({
                                    message: resp.data.message,
                                    showClose: true,
                                    type: 'error'
                                })
                            }
                        }
                    )
                } else {
                    return false;
                }
            })
        }
    }
}
</script>