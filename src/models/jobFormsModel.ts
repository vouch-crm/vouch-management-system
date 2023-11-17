import { String } from "aws-sdk/clients/codebuild";
import mongoose, { Schema } from "mongoose";

export interface IJobForm {
    id?: string,
    client?: string,
    paidMediaBrief?: {
        email: string,
        brandName: string,
        brandWebsite: string,
        companyBackground: string,
        brandValues: string,
        brandPropositionToCustomers: string,
        brandGoals: string,
        paidMediaGoals: string,
        toneOfVoice: string,
        customerValue: string,
        audienceIdentity: string,
        audienceAge: string,
        ineterestsAndHobbies: string,
        audienceTargeting: string,
        informationConsumption: string,
        publicIdentity: string,
        brandPreferences: string,
        competitorBrands: string,
        differenceFromCompetitor: string,
        customerBrandFeeling: string,
        customerBrandThoughts: string,
        customerBrandAct: string,
        budget: string,
        timeframe: Date,
        pointOfContact: string,
        activityDates: string,
        activityDatesBudget: string,
        accessToAnalyticsAndPaidMediaAccounts: boolean,
        channelSelection: [string],
        channelGoals: string,
        taggingForTracking: string,
        thirdPartyToolsAndApplications: string,
        locationTargeting: string,
        emailDatabaseLists: boolean,
        brandUSP: string,
        brandExperience: string,
        painPoints: string,
        customerGroups: string,
        exclusiveOffers: string,
        customerRetention: string,
        additionalInformation: string
    },
    creativeProjectBrief?: {
        projectName: string,
        workingOnProject: [string],
        projectOverview: string,
        reviewDate: Date,
        liveDate: Date,
        outputRequired: string,
        outputDescription: string,
        referenceFiles: [string],
        projectBudget: string,
        additionalInformation: string
    },
    brandIdentityBrief?: {
        brandStory: string,
        brandCore: string,
        brandStrength: string,
        brandWeakness: string,
        brandDifferentiators: string,
        brandPositioning: string,
        brandVision: string,
        brandMission: string,
        brandValue: string,
        brandImage: string,
        brandPersonality: string,
        brandVoice: string,
        brand10IndividualWords: string,
        targetAudience: string,
        targetAudienceMotivations: string,
        brandMainCompetitors: string,
        competitorsAwareOfActions: string,
        brandFutureVision: string,
        marketDesiredPositioning: string,
        keyChallenges: string,
        keyCommercialObjectives: string,
        brandingDeliverables: string,
        brandGuidlines: string,
        existingBrandGuidelines: string,
        additionalInfo: string,
        budget: string,
        delievryDate: Date
    },
    websiteBriefing?: {
        email: string,
        websitePurpose: string,
        websiteAspectsLove: string,
        websiteAspectsHate: string,
        websiteRemovedAspects: string,
        websiteMustStayAspects: string,
        productsOrServicesPerLocation: string,
        businessUVP: string,
        servicesHighlighted: string,
        websiteVisitorsReason: string,
        websiteEasyNavigate: string,
        visitorsToSales: string,
        competitorsWebsitesUpdates: string,
        contentDeliverRightMessage: string,
        websiteGoodBusinessRepresentation: string,
        websiteInstillTrustAndConfidence: string,
        websiteEastToUpdate: string,
        trackedVisitors: string,
        toolsAndAppsToRunWebsite: string,
        newWebsite: string,
        proposedSitemapPrepared: string,
        idealWebsite: string,
        websiteSpecificGoals: string,
        goalsAchievemnetPace: string,
        websiteNewFeatures: string,
        projectSuccessQualification: string,
        standApartFeatures: string,
        onlineActivityModel: string,
        top7Competitors: string,
        competitorsLikedFeatures: string,
        competitorsHatedFeatures: string,
        likedWebsitesExamples: string,
        websiteContentUpdateFrequency: string,
        neededFunctionalRequirements: string,
        specificFeatureNeeded: string,
        usersContentInteractions: string,
        websiteChatOptions: string,
        websiteInternalSearchEngine: string,
        audioOrVideoOptions: string,
        videoHostingOptions: string,
        sellThroughWebsite: string,
        websiteAudienceCommunication: string,
        necessaryFeaturesForAudienceIncluded: string,
        websiteEasyNavigation: string,
        StructureAndDigestibleInformationWhiteSpace: string,
        colorThemeRelevancy: string,
        copyEffectiveness: string,
        websiteDistractions: string,
        CTAEvident: string,
        websiteChanges: string,
        FeaturesAndFunctionsToAdd: string,
        websiteSuggestions: string,
        elementsNeedToBeRemoved: string,
        newWebsiteElementsDesign: string
    },
    appBrief?: {
        email: string,
        appchallenge: string,
        keyInformationIncludedInApp: string,
        appObjectives: string,
        appIntendedAudience: string,
        appSectionsOrPages: string,
        appKeyFeatures: string,
        nativeAppOrMobileWebApp: string,
        mandatoryInclusions: string,
        additionalFeatures: string,
        deliveryDate: String,
        budget: string,
        additionalInformation: string
    },
    CROBrief?: {
        email: string,
        projectName: string,
        existingURLsReference: string,
        websiteConversionRate: string,
        websitePaidTrafficPage: string,
        challengesToOvercome: string,
        pagesRequireABTesting: string,
        hotJarData: string,
        ABSolutionUsed: string,
        firebaseInsights: string,
        pagesWithMostUsers: string,
        mostDropOff: string,
        bounceRateForPageOrCategory: string,
        idealBounceRate: string,
        bestConversionRatePage: string,
        competitorUXJourneysLiked: string,
        competitorUXJourneysNotLiked: string,
        reviewLearningsOptimisationDate: Date,
        additionalInfo: string
    },
    UiUxBrief?: {
        email: string,
        projectName: string,
        brandGuidelines: string,
        projectDescription: string,
        projectMotivation: string,
        pastExepriencesWithUiUx: string,
        UXFrustrations: string,
        killerFeatureOrExperience: string,
        brandVision: string,
        projectElevatorPitch: string,
        biggestCompetitorsInfo: string,
        idealProjectOutcome: string,
        businessBenefit: string,
        userBenefit: string,
        projectSuccessMetric: string,
        targetAudience: string,
        customerServiceManagement: string,
        availableData: string,
        conductedResearch: string,
        analytics: string,
        workOnNeeded: string,
        designTeamDonotChallenge: string,
        successRisks: string,
        couldGoWrong: string,
        deadlineMissPenalty: string,
        projectFail: string,
        expectedDeliverables: string,
        deliverablesNextUse: string,
        currentDeadlinesAndMilestones: string,
        expectedProjectStartDate: string,
        projectDelayActions: string,
        ultimateDecisionMaker: string,
        additionalInfo: string
    }
}

const jobFormSchema: Schema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
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
        audienceAge: String,
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
        budget: String,
        timeframe: Date,
        pointOfContact: String,
        activityDates: String,
        activityDatesBudget: String,
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
        projectBudget: String,
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
        budget: String,
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
        trackedVisitors: String,
        websiteEasyToUpdate: String,
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
        elementsNeedToBeRemoved: String,
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
        deliveryDate: String,
        budget: String,
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
        competitorUXJourneysLiked: String,
        competitorUXJourneysNotLiked: String,
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
        expectedProjectStartDate: String,
        projectDelayActions: String,
        ultimateDecisionMaker: String,
        additionalInfo: String
    }
});

export const jobFormsAgent = mongoose.model<IJobForm>('jobform', jobFormSchema);