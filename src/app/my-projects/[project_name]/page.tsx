'use client'

import { urls } from '@/apis/urls';
import ProjectPageLayout from '@/layout/specific_layout/ProjectPageLayout';
import { ApiService } from '@/lib/axios_generic';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { nkey } from '@/data/keyStore';

const ProjectPage: FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  const project_name = decodeURIComponent(pathname.split('/').pop() || '')

  const [campaignsData, setCampaignsData] = useState([])

  const getCampaigns = async () => {
    try {
      const clientId = Cookies.get(nkey.client_ID)
      const response = await ApiService.get<any>(`${urls.getCampaigns}?clientId=${clientId}&project=${project_name}`)

      if (response.isSuccess) {
        setCampaignsData(response.campaigns)
      }
    } catch (error) {
      console.error('API Error:', ApiService.handleError(error));
      alert(ApiService.handleError(error));
    }
  }

  useEffect(() => {
    getCampaigns()
  }, [project_name])


  const tableData = [
    {
      projectName: 'Storage Asia 2024',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',

    },
    {
      projectName: 'Campaign Name',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
    },
    {
      projectName: 'Campaign Name',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
    }
  ];

  const tableHeading = ["Project Name", "Created On", "Last Edited"]

  const headerHavingSortingToggle = ["Project Name", "Created On", "Last Edited"]

  const onSelectingProject = (campaign_id: string) => {
    router.push(`/my-projects/${project_name}/${campaign_id}`)
  }

  const campaignsDatas = campaignsData.map((campaign: any) => {
    return {
      campaignName: campaign.campaignName,
      createdOn: campaign.createdOn.split('T')[0],
      LastEdited: campaign.modifiedOn || "not edited yet",
      campaignID: campaign.campaignID
    };
  });

  return (
    <>
      <ProjectPageLayout
        project_data={campaignsDatas}
        onSelectingProjects={onSelectingProject}
        tableHeadings={tableHeading}
        headersHavingToggle={headerHavingSortingToggle}
        page={project_name}
        hiddenFields={["campaignID"]}
        viewType='campaign'
      />
    </>
  )
}

export default ProjectPage