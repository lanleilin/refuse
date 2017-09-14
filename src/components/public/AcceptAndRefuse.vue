<template>
	<div class="accept-container">
		<div class="accept-wrap">
			<iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
			<el-button type="info" @click="checkVideo" class='result-customer-btn item'>通过</el-button>
			<el-button type="danger" @click="refuseFun" class='result-customer-btn item'>驳回</el-button>
			<div class="item"></div>
			<div class="item"></div>

			<el-dialog title="温馨提示" :visible.sync="dialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="close" size="tiny">
				<iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
				<span>请先完成录像与拍照</span>
				<span slot="footer" class="dialog-footer">
		            <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
		            <el-button type="primary" @click="dialogVisible = false" class="btn-confirm">确 定</el-button>
		        </span>
			</el-dialog>

			<!-- Form -->

			<el-dialog title="拒绝原因" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" @close="close">
				<iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
				<el-form :model="form">
					<el-form-item label="" :label-width="formLabelWidth">
						<el-input type="textarea" id='refuse-reason' v-model="form.region" :rows='2' auto-complete="off" placeholder="请输入原因"></el-input>
					</el-form-item>
					<el-form-item label="" :label-width="formLabelWidth">

						<el-select id='select-reason' placeholder="选择常见驳回原因" v-model="form.region">
							<el-option v-for="item in refuseReason" :key="item.returnType" :label="item.returnDesc" :value="item.returnDesc">
							</el-option>
						</el-select>
					</el-form-item>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="refuseConfirm" class="btn-confirm">确 定</el-button>
				</div>
			</el-dialog>
			<!--进度条-->
			<el-dialog title="文件上传中" :visible.sync="dialogBarVisible" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
				<el-progress :text-inside="true" :stroke-width="18" :percentage=rate></el-progress>
				<iframe id="dialogFrame" frameborder="0" scrolling="no" style="background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;"></iframe>
				<span slot="footer" class="dialog-footer">
			  </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: false,
				dialogTableVisible: false,
				dialogFormVisible: false,
				dialogBarVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				data: {
					Status: 3,
					returnDesc: 'reason',
					returnType: 2
				},
				rate: 0,
				snapPath: '',
				videoPath: '',
				progressFlag: 0,
				refuseFlag: 0,
				refuseReason:[],
				refuseConfirmFlag:0,
				formLabelWidth: '10px'
			};
		},
		created: function() {
			this.getProblemList();
		},
		props: ['snapPicParentFinish', 'filePathUrlFinish'],
		methods: {
			checkVideo: function() {
				console.info(this.snapPicParentFinish);
				console.info(this.filePathUrlFinish);
				this.refuseFlag = 0;
				if(!this.snapPicParentFinish || !this.filePathUrlFinish) {
					this.dialogVisible = true
				} else {
					this.dialogBarVisible = true;
					this.uploadF()
				}

				this.$emit('visibility-hidden', true);
			},
			refuseFun: function() {
				this.refuseFlag = 1;
				this.dialogFormVisible = true;
				this.$emit('visibility-hidden', true);
			},
			close: function() {
				if(this.refuseConfirmFlag==1){

				}else{
					this.$emit('after-close', false);
				}
			},

			//上传视频方法
			uploadF: function() {
				var taskVideo = instance.createFileUploadTask({
					localPath: this.filePathUrlFinish,
					intervalTime: 1,
					done: this.onFileUploadDoneV,
					onTaskStatusChanged: this.onTaskStatusChangedV
				});
				taskVideo.start();

			},
			//上传图片方法
			uploadP: function() {
				var taskPic = instance.createFileUploadTask({
					localPath: this.snapPicParentFinish,
					intervalTime: 1,
					done: this.onFileUploadDone,
					onTaskStatusChanged: this.onTaskStatusChanged
				});
				taskPic.start();
			},
			//图片上传回调
			onFileUploadDone: function(result, data) {
				if(result.code == 0) {
					console.log("图片上传业务服务器成功");
					this.uploadF();

				}
			},
			onTaskStatusChanged: function(data) {
				console.log('图片上传进度')
			},
			//视频上传回调
			onFileUploadDoneV: function(result, data) {
				if(result.code == 0) {
					console.log('视频上传回调')
					this.videoPath = data.filePath;
					var filecode = Math.random();
					this.$http({
						method: 'POST',
						url: "/AnyChatFaceX/v1/client/addVideo",
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: {
							'tradeno': AnyChat.clientData.tradeNo,
							'filehashcode': filecode
						},
						emulateJSON: true
					}).then(function(res) {
						console.log("视频上传业务服务器成功");
						this.$http({
							method: 'POST',
							url: "/AnyChatFaceX/v1/client/addVideo",
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							body: {
								'tradeno': AnyChat.clientData.tradeNo,
								'filehashcode': filecode,
								'videourl': this.videoPath,
								'videolen': '',
								'validity': 0
							},
							emulateJSON: true
						}).then(function(res) {
							console.log("视频绑定流水成功");
							if(this.refuseFlag) {
								this.refuse();
							} else {
								this.pass();
							}
						})
					})
				}
			},
			onTaskStatusChangedV: function(data) {
				console.log("视频上传进度")
				var _this = this;

				_this.rate = data.progress

				if(parseInt(this.rate) == 100) {
					this.dialogBarVisible = false;
					this.progressFlag = 1;
					this.$emit('visibility-hidden', true);
				}
			},
			//通过方法
			pass: function() {
				var url = '/AnyChatFaceX/web/client/trade/faceSignResult';
				this.$http({
					method: 'POST',
					url: url,
					headers: {
						'Content-Type': 'application/json'
					},
					body: {
						"Status": 0,
						"returnType": 0,
						"returnDesc": ''
					},
					emulateJSON: true
				}).then(function(res) {
					console.log("通过成功");
					this.$emit('pass-success', true);

				})
			},
			//驳回方法
			refuse: function() {
				console.log(this.form);
				//				this.dialogFormVisible = false
				var url = '/AnyChatFaceX/web/client/trade/faceSignResult';
				this.$http({
					method: 'POST',
					url: url,
					headers: {
						'Content-Type': 'application/json'
					},
					body: {
						"Status": 3,
						"returnType": 0,
						"returnDesc": this.form.region
					},
					emulateJSON: true
				}).then(function(res) {
					console.log("驳回成功");
					this.$emit('pass-success', true);
				})
			},
			refuseConfirm: function() {
				this.dialogFormVisible=false;
				this.refuseConfirmFlag=1;
				if(this.filePathUrlFinish) {
					this.dialogBarVisible=true;
					this.uploadF();
				} else {
					this.refuse();
				}
			},
			getProblemList: function() {
				console.log('yes')
				var url = '/AnyChatFaceX/trade/getReturnDescList';
				this.$http.get(url).then(function(res){
					var rows = res.body.content;
					this.refuseReason = rows;
				})
			}

		}
	};
</script>
<style scoped>
	.accept-container {
		display: block;
		/*width: 100%;*/
		justify-content: center;
		align-items: center;
		text-align: left;
	}
	
	.accept-container .accept-wrap {
		display: flex;
	}
	
	.item {
		flex: 1;
	}
	
	.el-form-item__content {
		margin-left: 0 !important;
	}
	
	#select-reason {
		width: 100%;
	}
	
	.btn-confirm {
		color: #fff;
		background-color: #337ab7;
		border-color: #2e6da4;
	}
	
	#back {
		background: #007ECE;
	}
	
	.result-customer-btn {
		padding: 6px 15px;
	}
</style>