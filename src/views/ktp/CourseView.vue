<template>
    <el-container id="container">
        <el-header style="border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 0; height: 80px; background: linear-gradient(to right, rgba(0,191,255, 0.5), rgba(30,144,255, 0.5)); display: flex; align-items: center; justify-content: center; font-size: 48px; color: white;">  
            课堂派查询  
        </el-header>
        <el-main style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;background-color: rgba(135,206,250, 0.1);">
            <div class="user-info">
                <el-avatar class="avatar" :size="40" :src="user_data.avatar"></el-avatar>
                <span class="username">{{ user_data.username }}</span>
            </div>
            <br>
            <div><el-button icon="el-icon-delete" @click="clear_token">清除登入信息</el-button></div>
            <br>
            <!-- 课程列表 -->
            <el-tabs v-model="activeSemester" type="border-card" @tab-click="tab_handleClick">
                <el-tab-pane 
                    :key="idx" 
                    :label="semester.semester + ' ' + semester.termTxt" 
                    :name="semester"
                    v-for="(semester, idx) in semesters">
                    <el-button style="margin: 0 0 10px 0;" icon="el-icon-search" @click="search_all_unfinsh_task">查询当前学期未完成的作业</el-button>
                    <el-table class="course_table" :data="tableData">
                        <el-table-column prop="coursename" label="课程名" width="600px"></el-table-column>
                        <el-table-column prop="username" label="教师" width="200px"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="row_handleClick(scope.row)" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 课程信息 -->
            <el-dialog
            :title="course_detail.coursename"
            :visible.sync="course_dialog_visible"
            width="90%"
            @open="course_dialogue_open"
            @closed="course_dialogue_closed"
            close-on-click-modal="false"
            >
                <!-- 课程信息介绍 -->
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                    <span>课程信息</span>
                    
                    <el-popconfirm
                    title="你确定要退课吗？"
                    confirm-button-text='是的，我确定！'
                    cancel-button-text='不，我后悔了！'
                    @confirm="incomplete_button_clicked"
                    >
                    <el-button slot="reference" style="float: right; padding: 3px 0" type="text">退课</el-button>
                    </el-popconfirm>
                    
                    </div>
                    <!-- <span>课程信息：</span><br> -->
                    <span style="text-indent: 20px;"><i class="el-icon-user">教师：</i>{{ course_detail.username }}</span><br>
                    <span style="text-indent: 20px;"><i class="el-icon-user-solid">班级：</i>{{  course_detail.classname  }}</span><br>
                    <span style="text-indent: 20px;"><i class="el-icon-s-custom">总人数：</i>{{ course_detail.total }}    选课人数：{{ course_detail.selectStudentCount }}</span><br>
                    <!-- <span style="text-indent: 20px;"><i class="el-icon-s-ticket">加课码：</i>{{ course_detail.code }}</span> -->
                    <el-popover
                    placement="right"
                    trigger="click">
                        或许这里以后有加课二维码吧。
                        <span slot="reference" style="text-indent: 20px;"><i class="el-icon-s-ticket">加课码：</i>{{ course_detail.code }}</span>
                    </el-popover>
                </el-card><br>
                <!-- <el-divider></el-divider> -->
                <el-tabs v-model="activeCoursePage" type="border-card" @tab-click="course_tab_handleClick">
                    <el-tab-pane
                    label="作业"
                    name="task"
                    >
                        <el-table :data="course_detail.task">
                            <el-table-column width="300px" prop="title" label="作业名"></el-table-column>
                            <el-table-column width="180px" label="创建时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.createtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="更新时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.updatetime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="结束时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.endtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="剩余时间">
                                <template slot-scope="scope">
                                    {{second2time(scope.row.endtime*1000 - Date.now())}}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="状态">
                                <template slot-scope="scope">
                                    <span style="color: red;" v-if="scope.row.mstatus==0">未提交</span>
                                    <span style="color: green;" v-else-if="scope.row.mstatus==1">已提交</span>
                                    <span style="color: aqua;" v-else-if="scope.row.mstatus==2 || scope.row.mstatus==4">已批改</span>
                                    <span style="color: brown;" v-else-if="scope.row.mstatus==3">被打回</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="是否查重">
                                <template slot-scope="scope">
                                    {{scope.row.checkrepeat?'是':'否'}}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" prop="warmingcheckrate" label="查重率"></el-table-column>
                            <el-table-column label="成绩">
                                <template slot-scope="scope">
                                    <span v-if="scope.grade">{{scope.row.grade+'/'+scope.fullscore}}</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                    <el-tab-pane
                    label="测试"
                    name="test"
                    >
                        <el-table :data="course_detail.test">
                            <el-table-column width="300px" prop="title" label="测试名"></el-table-column>
                            <el-table-column width="180px" label="创建时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.createtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="开始时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.begintime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" prop="endtime" label="结束时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.endtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="限时">
                                <template slot-scope="scope">
                                    {{ second2time(scope.row.timelength*1000) }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="剩余时间">
                                <template slot-scope="scope">
                                    {{second2time(scope.row.endtime*1000 - Date.now())}}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="状态">
                                <template slot-scope="scope">
                                    <span style="color: lightcoral;" v-if="scope.row.submit_state==1">未参与</span>
                                    <span style="color: red;" v-else-if="scope.row.submit_state==2">未提交</span>
                                    <span style="color: brown;" v-else-if="scope.row.submit_state==3">被打回</span>
                                    <span style="color: green;" v-else-if="scope.row.submit_state==4 || scope.row.mstatus==5">已提交</span>
                                    <span style="color: aqua;" v-else-if="scope.row.submit_state>5">已批改</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="成绩">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.score!=null">{{scope.row.score+'/'+scope.row.total_score}}</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                    <el-tab-pane
                    label="考勤"
                    name="attendance"
                    >
                    <el-table :data="course_detail.attendance">
                            <el-table-column width="300px" prop="title" label="考勤名"></el-table-column>
                            <el-table-column width="180px" label="创建时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.createtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="结束时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.overtime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="考勤类型">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.type==1">数字考勤签到</span>
                                    <span v-else-if="scope.row.type==2">GPS签到</span>
                                    <span v-else-if="scope.row.type==3 || scope.row.type==0">二维码签到</span>
                                    <span v-else-if="scope.row.type==4">签入签出考勤</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" label="签到时间">
                                <template slot-scope="scope">
                                    {{ new Date(scope.row.signTime*1000).toLocaleString() }}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="限时">
                                <template slot-scope="scope">
                                    {{ second2time(scope.row.duration*1000) }}
                                </template>
                            </el-table-column>
                            <el-table-column width="150px" label="状态">
                                <template slot-scope="scope">
                                    <span style="color: green;" v-if="scope.row.state==0">出勤</span>
                                    <span style="color: red;" v-else-if="scope.row.state==1">旷课</span>
                                    <span style="color: lightcoral;" v-else-if="scope.row.submit_state==2">迟到</span>
                                    <span style="color: cornflowerblue;" v-else-if="scope.row.state==3">请假</span>
                                    <span style="color: cornflowerblue;" v-else-if="scope.row.state==4">事假</span>
                                    <span style="color: cornflowerblue;" v-else-if="scope.row.state==5">病假</span>
                                    <span style="color: cornflowerblue;" v-else-if="scope.row.state==6">公假</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="ip">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.ip">{{scope.row.ip}}</span>
                                    <span style="color: chocolate;" v-else>未知</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="course_dialog_visible = false; activeCoursePage = null">关闭</el-button>
                </span>
            </el-dialog>

            <!-- 查询当前学期未完成的作业 -->
            <el-dialog
            :title="activeSemester.semester + ' ' + activeSemester.termTxt + '未完成作业 —— 共'+ all_unfinsh_task.length + '项'"
            :visible.sync="all_task_dialog_visible"
            width="90%"
            @open="all_task_dialogue_open"
            @closed="all_task_dialogue_closed"
            close-on-click-modal="false"
            >
                <el-table :data="all_unfinsh_task">
                    <el-table-column width="300px" prop="coursename" label="课程名"></el-table-column>
                    <el-table-column width="300px" prop="title" label="作业名"></el-table-column>
                    <el-table-column width="180px" label="创建时间">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.createtime*1000).toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column width="180px" label="更新时间">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.updatetime*1000).toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column width="180px" label="结束时间">
                        <template slot-scope="scope">
                            {{ new Date(scope.row.endtime*1000).toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column width="180px" label="剩余时间">
                        <template slot-scope="scope">
                            {{second2time(scope.row.endtime*1000 - Date.now())}}
                        </template>
                    </el-table-column>
                    <el-table-column width="150px" label="是否查重">
                        <template slot-scope="scope">
                            {{scope.row.checkrepeat?'是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column width="150px" prop="warmingcheckrate" label="查重率"></el-table-column>
                </el-table>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
import axios from 'axios';


export default {
    data(){
        return{
            //用户信息
            user_data: '',
            
            semesters: null,
            activeSemester: {},
            //课程表格信息
            tableData:[],
            //当前学期所有未完成作业
            all_unfinsh_task: [],

            course_dialog_visible: false,
            activeCoursePage: null,
            course_detail:{},

            all_task_dialog_visible: false,

            isUpdate: false
        }
    },
    methods: {
        incomplete_button_clicked(){
            alert('这个功能还未实装！')
        },

        tab_handleClick(){
            const config = {  
                headers:{
                    'Token':this.$token,
                    'origin':null
                }
            };
            
            const data = {
                "isstudy": "1",
                "search": "",
                "semester": this.activeSemester.semester,
                "term": this.activeSemester.term,
                "reqtimestamp": Date.now()
            };

            axios.post("https://openapiv5.ketangpai.com//CourseApi/semesterCourseList", data, config).then(
                resp => {
                    this.tableData = resp.data.data
                }
            )
        },

        row_handleClick(row){
            this.course_detail = row
            // this.course_detail.task = []
            // this.course_detail.test = []
            // this.course_detail.attendance = []

            const config = {  
                headers:{
                    'Token':this.$token,
                    'origin':null
                }
            };

            // 作业
            const data_task = {
                'courseid': this.course_detail.id,
                'contenttype':4,
                "dirid":0,
                'lessonlink':[],
                'sort':[],
                'page':1,
                'limit':50,
                'desc':3,
                'courserole':0,
                'vtr_type':'',
                'regtimestampe': Date.now()
            }

            const data_test = {
                'courseid': this.course_detail.id,
                'contenttype':6,
                "dirid":0,
                'lessonlink':[],
                'sort':[],
                'page':1,
                'limit':50,
                'desc':3,
                'courserole':0,
                'vtr_type':'',
                'regtimestampe': Date.now()
            }

            const data_attendance = {
                'courseid': this.course_detail.id,
                'regtimestampe': Date.now()
            }

            Promise.all([axios.post("https://openapiv5.ketangpai.com//FutureV2/CourseMeans/getCourseContent", data_task, config).then(
                        resp => {
                            this.course_detail.task = resp.data.data.list
                        }
                    ),
                    axios.post("https://openapiv5.ketangpai.com//FutureV2/CourseMeans/getCourseContent", data_test, config).then(
                        resp => {
                            this.course_detail.test = resp.data.data.list
                        }
                    ),
                    axios.post("https://openapiv5.ketangpai.com//SummaryApi/attence", data_attendance, config).then(
                        resp => {
                            this.course_detail.attendance = resp.data.data.data
                            console.log('考勤：'+this.course_detail.attendance)
                        }
                    )
                ]
            ).then(resp=>{console.log(resp.data);this.course_dialog_visible = true;})
        },

        course_dialogue_open(){
            console.log(this.course_detail.task)
        },

        course_dialogue_closed(){
            //this.activeCoursePage = null
            this.course_detail = {}
        },

        second2time(value){
            if(value<0) return '已结束';
            value = parseInt(value)

            let days = parseInt(value / (24*60*60*1000));
            let hours = parseInt((value - (days*(24*60*60*1000))) / (60*60*1000));
            let m = parseInt((value - (days*(24*60*60*1000)) - hours*(60*60*1000)) / (60*1000));
            let s = parseInt((value - (days*(24*60*60*1000)) - hours*(60*60*1000) - m*(60*1000)) / (1000));
            let res = ''
            
            if (days > 0){
                res += days+'天 '
            }
            if(hours > 0){
                res += hours+'小时 '
            }
            if(m > 0){
                res += m+'分钟 '
            }
            if(s > 0){
                res += s+'秒 '
            }
            if(res == '') return '已结束'

            return res;
        },

        search_all_unfinsh_task(){
            const config = {  
                headers:{
                    'Token':this.$token,
                    'origin':null
                }
            };

            const requests = this.tableData.map(item => {  
                const data = {  
                    'courseid': item.id,  
                    'contenttype': 4,  
                    "dirid": 0,  
                    'lessonlink': [],  
                    'sort': [],  
                    'page': 1,  
                    'limit': 50,  
                    'desc': 3,  
                    'courserole': 0,  
                    'vtr_type': '',  
                    'regtimestampe': Date.now()  
                };  
  
                // 返回一个Promise  
                return axios.post("https://openapiv5.ketangpai.com/FutureV2/CourseMeans/getCourseContent", data, config)  
                    .then(resp => {  
                        // 在这里处理响应数据  
                        resp.data.data.list.forEach(task => {  
                            if (task.mstatus === 0) {  
                                task.coursename = item.coursename
                                this.all_unfinsh_task.push(task)
                            }  
                        });  
                    });  
            }); 
            Promise.all(requests).then(
                resp => {
                    console.log(resp.data)
                    console.log(this.all_unfinsh_task)
                    this.all_task_dialog_visible = true
                }
            )
        },
        all_task_dialogue_closed(){
            this.all_unfinsh_task = []
        },
        clear_token(){
            localStorage.clear()
        },
        getUserBasinInfo(){
            const config = {  
                headers:{
                    'Token':this.$token,
                }
            };

            const data = {
                "reqtimestamp": Date.now()
            }

            axios.post('https://openapiv5.ketangpai.com//UserApi/getUserBasinInfo', data, config).then( resp => {
                    console.log(resp.data.message)
                    if(resp.data.status==1){
                        this.user_data = resp.data.data
                        console.log(this.user_data)
                    }
                }
            )
        }
    },
    mounted(){
        // if(localStorage.getItem('autologin')){
        //     this.$token = localStorage.getItem('token')
        // }
        this.$token = localStorage.getItem('token')
        if(!this.$token){
            this.$message({
                showClose: true,
                message: "登入信息过期，请重新登入！",
                type: 'error'
            });
            setTimeout(()=>{this.$router.push('/login');}, 1000)
        }
        this.getUserBasinInfo()
        const config = {  
            headers:{
                'Token':this.$token,
                'origin':null
            }
        };

        const data = {
            "isstudy": "1",
            "search": "",
            "reqtimestamp": Date.now()
        }
        
        axios.post(
            "https://openapiv5.ketangpai.com/CourseApi/semesterList", 
            data,
            config
        ).then(resp => {
            this.semesters = resp.data.data.semester
        })
    }
}
</script>

<style>
.course_table{
    margin: 0 auto;
    width: 80%;
}

#container{
    margin: 0 auto;
    width: 80%;
    border-radius: 8px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}

el-tab-pane{
    margin-bottom: 0;
}

.user-info {  
    display: flex;  
    align-items: center;  
} 

.avatar {  
    margin-right: 10px; /* 头像和用户名之间的间距 */  
}  

.username{
    font-size: 16px;
}
</style>