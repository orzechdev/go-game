<template>
  <v-dialog v-model="show" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Privacy Policy</v-card-title>

      <v-card-text>
        <privacy-policy-text :privacyPolicyEntityName="privacyPolicyEntityName">
        </privacy-policy-text>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="onCloseClick">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PrivacyPolicyText from './PrivacyPolicyText'

export default {
  components: {
    PrivacyPolicyText,
  },
  props: {
    show: {
      type: Boolean,
    },
    privacyPolicyEntityName: {
      type: String,
    }
  },
  methods: {
    onCloseClick() {
      this.$emit("onCloseClick");
    }
  },
  watch: {
    show (val) {
      !val && this.$emit("onCloseClick");
    }
  }
};
</script>
