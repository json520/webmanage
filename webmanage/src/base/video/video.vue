<template>
  	<div id="videoWrapper">
  		
  		<video ref="videoPlayer" :src="videoUrl" width="640" height="320" autoplay controls></video>
  		
  	</div>
		
</template>

<script>
  import videojs from 'video.js'
  export default {
  	props:[
  		'videoUrl'
  	],
    data() {
      return {
        videoPlayUrl:''
      }
    },
    watch:{
	  	videoUrl(){
	  		this.videoPlayUrl = videoUrl
	  	}
	},
    mounted() {
      // console.log('this is current player instance object', this.player)
//    this._initVideo();
    },
    computed: {
      
    },
    methods: {
  		_setInitVideoUrl(){
  			
  		}
    }
  }
</script>
