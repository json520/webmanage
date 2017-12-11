<template>
	<div class="page404">
		
	    <p class="page-container">404 page not found</p>
	    <router-link :to="{path:'/login'}" tag="p">重新登录</router-link>
	</div>
</template>

<style lang="scss" scoped>
   .page404 .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
    .page404 p{
    	font-size: 20px;
        text-align: center;
        cursor:pointer;
        color:#0082E6;
        margin:20px 0;
    }
</style>