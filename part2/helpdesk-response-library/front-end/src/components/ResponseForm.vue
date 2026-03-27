<template>
  <form action="#" @submit.prevent="onSubmit">
     <p v-if="errorsPresent" class="error">Please fill out both fields!</p>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
          Issue Code
       </div>
       <input type="text" placeholder="Enter issue code..." v-model="response.issue_code" />
     </div>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
          Response
       </div>
       <input type="text" placeholder="Enter response..." v-model="response.response" />
     </div>
 
     <button class="positive ui button">Submit</button>
   </form>
 </template>
 
 <script>
 export default {
   name: 'response-form',
   props: {
     response: {
       type: Object,
       required: false,
       default: () => {
        return {
          issue_code: '',
          response: ''
        }
       }
     }
   },
   data() {
     return {
       errorsPresent: false
     };
   },
   methods: {
     onSubmit: function() {
       if (this.response.issue_code === '' || this.response.response === '') {
         this.errorsPresent = true;
       } else {
         this.$emit('createOrUpdate', this.response);
       }
     }
   }
 };
 </script>
 
 <style scoped>
 .error {
   color: red;
 }
 </style>