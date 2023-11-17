"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobFormsAgent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jobFormSchema = new mongoose_1.Schema({
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    paidMediaBrief: {
        email: String,
        brandName: String,
        brandWebsite: String,
        companyBackground: String,
        brandValues: String,
        brandPropositionToCustomers: String,
        brandGoals: String,
        paidMediaGoals: String,
        toneOfVoice: String,
        customerValue: String,
        audienceIdentity: String,
        audienceAge: Number,
        ineterestsAndHobbies: String,
        audienceTargeting: String,
        informationConsumption: String,
        publicIdentity: String,
        brandPreferences: String,
        competitorBrands: String,
        differenceFromCompetitor: String,
        customerBrandFeeling: String,
        customerBrandThoughts: String,
        customerBrandAct: String,
        budget: Number,
        timeframe: Date,
        pointOfContact: String,
        activityDates: String,
        activityDatesBudget: Number,
        accessToAnalyticsAndPaidMediaAccounts: {
            type: Boolean,
            default: false
        },
        channelSelection: [String],
        channelGoals: String,
        taggingForTracking: String,
        thirdPartyToolsAndApplications: String,
        locationTargeting: String,
        emailDatabaseLists: {
            type: Boolean,
            default: false
        },
        brandUSP: String,
        brandExperience: String,
        painPoints: String,
        customerGroups: String,
        exclusiveOffers: String,
        customerRetention: String,
        additionalInformation: String
    },
    crativeProjectBrief: {
        projectName: String,
        workingOnProject: [String],
        projectOverview: String,
        reviewDate: Date,
        liveDate: Date,
        outputRequired: String,
        outputDescription: String,
        referenceFiles: [String],
        projectBudget: Number,
        additionalInformation: String
    },
    brandIdentityBrief: {
        brandStory: String,
        brandCore: String,
        brandStrength: String,
        brandWeakness: String,
        brandDifferentiators: String,
        brandPositioning: String,
        brandVision: String,
        brandMission: String,
        brandValue: String,
        brandImage: String,
        brandPersonality: String,
        brandVoice: String,
        brand10IndividualWords: String,
        targetAudience: String,
        targetAudienceMotivations: String,
        brandMainCompetitors: String,
        competitorsAwareOfActions: String,
        brandFutureVision: String,
        marketDesiredPositioning: String,
        keyChallenges: String,
        keyCommercialObjectives: String,
        brandingDeliverables: String,
        brandGuidlines: String,
        existingBrandGuidelines: String,
        additionalInfo: String,
        budget: Number,
        delievryDate: Date
    },
    websiteBriefing: {
        email: String,
        websitePurpose: String,
        websiteAspectsLove: String,
        websiteAspectsHate: String,
        websiteRemovedAspects: String,
        websiteMustStayAspects: String,
        productsOrServicesPerLocation: String,
        businessUVP: String,
        servicesHighlighted: String,
        websiteVisitorsReason: String,
        websiteEasyNavigate: String,
        visitorsToSales: String,
        competitorsWebsitesUpdates: String,
        contentDeliverRightMessage: String,
        websiteGoodBusinessRepresentation: String,
        websiteInstillTrustAndConfidence: String,
        websiteEastToUpdate: String,
        trackedVisitors: String,
        toolsAndAppsToRunWebsite: String,
        newWebsite: String,
        proposedSitemapPrepared: String,
        idealWebsite: String,
        websiteSpecificGoals: String,
        goalsAchievemnetPace: String,
        websiteNewFeatures: String,
        projectSuccessQualification: String,
        standApartFeatures: String,
        onlineActivityModel: String,
        top7Competitors: String,
        competitorsLikedFeatures: String,
        competitorsHatedFeatures: String,
        likedWebsitesExamples: String,
        websiteContentUpdateFrequency: String,
        neededFunctionalRequirements: String,
        specificFeatureNeeded: String,
        usersContentInteractions: String,
        websiteChatOptions: String,
        websiteInternalSearchEngine: String,
        audioOrVideoOptions: String,
        videoHostingOptions: String,
        sellThroughWebsite: String,
        websiteAudienceCommunication: String,
        necessaryFeaturesForAudienceIncluded: String,
        websiteEasyNavigation: String,
        StructureAndDigestibleInformationWhiteSpace: String,
        colorThemeRelevancy: String,
        copyEffectiveness: String,
        websiteDistractions: String,
        CTAEvident: String,
        websiteChanges: String,
        FeaturesAndFunctionsToAdd: String,
        websiteSuggestions: String,
        newWebsiteElementsDesign: String
    },
    appBrief: {
        email: String,
        appchallenge: String,
        keyInformationIncludedInApp: String,
        appObjectives: String,
        appIntendedAudience: String,
        appSectionsOrPages: String,
        appKeyFeatures: String,
        nativeAppOrMobileWebApp: String,
        mandatoryInclusions: String,
        additionalFeatures: String,
        deliveryDate: Date,
        budget: Number,
        additionalInformation: String
    },
    CROBrief: {
        email: String,
        projectName: String,
        existingURLsReference: String,
        websiteConversionRate: String,
        websitePaidTrafficPage: String,
        challengesToOvercome: String,
        pagesRequireABTesting: String,
        hotJarData: String,
        ABSolutionUsed: String,
        firebaseInsights: String,
        pagesWithMostUsers: String,
        mostDropOff: String,
        bounceRateForPageOrCategory: String,
        idealBounceRate: String,
        bestConversionRatePage: String,
        competitorUXJourneys: String,
        reviewLearningsOptimisationDate: Date,
        additionalInfo: String
    },
    UiUxBrief: {
        email: String,
        projectName: String,
        brandGuidelines: String,
        projectDescription: String,
        projectMotivation: String,
        pastExepriencesWithUiUx: String,
        UXFrustrations: String,
        killerFeatureOrExperience: String,
        brandVision: String,
        projectElevatorPitch: String,
        biggestCompetitorsInfo: String,
        idealProjectOutcome: String,
        businessBenefit: String,
        userBenefit: String,
        projectSuccessMetric: String,
        targetAudience: String,
        customerServiceManagement: String,
        availableData: String,
        conductedResearch: String,
        analytics: String,
        workOnNeeded: String,
        designTeamDonotChallenge: String,
        successRisks: String,
        couldGoWrong: String,
        deadlineMissPenalty: String,
        projectFail: String,
        expectedDeliverables: String,
        deliverablesNextUse: String,
        currentDeadlinesAndMilestones: String,
        expectedProjectStartDate: Date,
        projectDelayActions: String,
        ultimateDecisionMaker: String,
        additionalInfo: String
    }
});
exports.jobFormsAgent = mongoose_1.default.model('jobform', jobFormSchema);
