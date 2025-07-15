import { useAssetCraftStoreSelector } from "@/store/assetCraftStore";
import { FileText, Globe, Lightbulb, Target } from "lucide-react";

const ReviewSection = () => {
  const typeAndCampaignData = {
    assetType: 'Landing Page',
    template: 'Solution Overview',
    productSolution: 'Private Cloud',
    campaignName: 'HPE Private Cloud Q3',
    campaignGoal: 'Lead Generation',
    targetAudience: 'Existing Customers',
    campaignUrls: [
      'https://www.hpe.com/en/us/solutions/private-cloud.html',
      'https://www.hpe.com/en/us/solutions/new-solutions/private-cloud.html',
      'https://www.hpe.com/info/pvt-cloud-brief.in'
    ],
    campaignDocs: [
      'HPE_Private_Cloud_Brief.pdf',
      'Q3_Planning_Deck.pptx'
    ]
  };

  // Example data for Asset Details section
  const assetDetailsData = {
    assetName: 'Green Cloud',
    primaryMessage: 'Green Cloud is a cloud-based platform that offers a range of services for businesses to deploy and manage their applications and data. It is designed to be flexible, scalable, and cost-effective, making it an ideal choice for organizations of all sizes.',
    additionalInformation: 'Green Cloud is a cloud-based platform that offers a range of services for businesses to deploy and manage their applications and data. It is designed to be flexible, scalable, and cost-effective, making it an ideal choice for organizations of all sizes.',
    creativityLevel: 6,
    assetUrls: [],
    assetDocs: []
  };

  const campaignInformation = useAssetCraftStoreSelector.use.campaignInformation()
  const assetInformation = useAssetCraftStoreSelector.use.assetInformation()
  const assetType = useAssetCraftStoreSelector.use.assetType()

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-green-500" />
        </div>s
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const DataField = ({ label, value, isList = false }) => (
    <div className="mb-4 last:mb-0 flex items-start gap-2">
      <dt className="text-base text-gray-600 font-bold min-w-[130px] text-start">{label}&nbsp;:</dt>
      <dd className="text-gray-900 text-base text-start">
        {isList ? (
          value.length > 0 ? (
            <ul className="space-y-1">
              {value.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm break-all">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400 text-sm italic">None provided</span>
          )
        ) : (
          <span className="text-sm">{value || 'Not specified'}</span>
        )}
      </dd>
    </div>
  );

  const CreativityMeter = () => (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-600">Creativity Level</span>
          <span className="text-sm font-semibold text-gray-900">{campaignInformation.outputScale}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-300 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${campaignInformation.outputScale * 10}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="w-full max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Type and Campaign Section */}
          <div className="space-y-6">
            <InfoCard icon={Target} title="Type and Campaign">
              <dl className="space-y-4">
                <DataField label="Asset Type" value={assetType} />
                <DataField label="Template" value={typeAndCampaignData.template} />
                <DataField label="Product/Solution" value={campaignInformation.product} />
                <DataField label="Campaign Name" value={campaignInformation.campaignName} />
                <DataField label="Campaign Goal" value={campaignInformation.campaignGoal} />
                <DataField label="Target Audience" value={campaignInformation.targetAudience} />
              </dl>
            </InfoCard>

            <InfoCard icon={Globe} title="Campaign Resources">
              <dl className="space-y-4">
                <DataField 
                  label="Campaign URLs" 
                  value={campaignInformation.webUrl} 
                  isList={true} 
                />
                <DataField 
                  label="Campaign Documents" 
                  value={typeAndCampaignData.campaignDocs} 
                  isList={true} 
                />
              </dl>
            </InfoCard>
          </div>

          {/* Asset Details Section */}
          <div className="space-y-6">
            <InfoCard icon={FileText} title="Asset Details">
              <dl className="space-y-4">
                <DataField label="Asset Name" value={assetDetailsData.assetName} />
                <DataField label="Primary Message" value={assetDetailsData.primaryMessage} />
                <DataField label="Additional Information" value={assetDetailsData.additionalInformation} />
              </dl>
            </InfoCard>

            <InfoCard icon={Lightbulb} title="Creative Configuration">
              <div className="mb-4">
                <CreativityMeter/>
              </div>
              <dl className="space-y-4">
                <DataField 
                  label="Asset URLs" 
                  value={assetDetailsData.assetUrls} 
                  isList={true} 
                />
                <DataField 
                  label="Asset Documents" 
                  value={assetDetailsData.assetDocs} 
                  isList={true} 
                />
              </dl>
            </InfoCard>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewSection