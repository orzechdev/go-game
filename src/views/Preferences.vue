<template>
<v-content class="content">
    <v-flex xs12 sm6 class="button-container">
        <v-select 
            :value="boardSizeSelected" 
            @change="setBoardSizeSelected" 
            :items="boardSizes" 
            label="Board size"
        ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
        <v-select 
            :value="algorithmsTypeSelected" 
            @change="setAlgorithmsTypeSelected" 
            :items="algorithmsTypes" 
            label="Algorithms type"
        ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
        <v-select 
            :value="calculationDepthSelected" 
            @change="setCalculationDepthSelected" 
            :items="calculationDepths" 
            label="Calculation depth" 
            :error-messages="calculationDepthSelected < 3 ? [] : 'Selected depth can significantly increase the calculation time and cause the application to hang!'"
        ></v-select>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
        <v-switch 
            color="primary" 
            :input-value="developerOptions" 
            @change="setDeveloperOptions" 
            :label="`Developer options: ${developerOptions ? 'on' : 'off'}`"
        ></v-switch>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
        <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 sm6 class="button-container">
        <v-list-tile avatar @click.stop="showPrivacyPolicy = true" class="privacy-policy">
            <v-list-tile-action>
                <v-icon>book</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Show privacy policy</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <privacy-policy-dialog 
            :show="showPrivacyPolicy" 
            :privacyPolicyEntityName="`Go Game`" 
            @onCloseClick="showPrivacyPolicy = false"
        ></privacy-policy-dialog>
    </v-flex>
</v-content>
</template>

<script>
import {
    mapState,
    mapActions
} from 'vuex'
import PrivacyPolicyDialog from '@/components/PrivacyPolicyDialog.vue'
import {
    algorithmsTypes
} from "@/components/BoardController.vue"

export default {
    name: "home",
    components: {
        PrivacyPolicyDialog
    },
    computed: {
        ...mapState([
            'developerOptions',
            'boardSizeSelected',
            'algorithmsTypeSelected',
            'calculationDepthSelected',
        ]),
    },
    data() {
        return {
            calculationDepths: [1, 2, 3],
            boardSizes: [19, 17, 13, 11, 9, 5],
            algorithmsTypes: [algorithmsTypes.MIN_MAX, algorithmsTypes.MIN_MAX_A_B],
            showPrivacyPolicy: false,
        }
    },
    methods: {
        ...mapActions([
            'setDeveloperOptions',
            'setBoardSizeSelected',
            'setAlgorithmsTypeSelected',
            'setCalculationDepthSelected',
        ]),
    },
};
</script>

<style lang="scss">
.content {
    margin: 0 20px;
}

.button-container {
    margin: 30px auto;
}

.privacy-policy>a {
    padding: 0;
}
</style>
