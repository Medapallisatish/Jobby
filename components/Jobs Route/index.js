import {Component} from 'react'
import Cookies from 'js-cookie'
import {FcSearch} from 'react-icons/fc'
import {IoMdStar} from 'react-icons/io'
import {BsFillBagFill} from 'react-icons/bs'
import {ImLocation2} from 'react-icons/im'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsRoute extends Component {
  state = {profileList: [], jobsList: []}

  componentDidMount() {
    this.renderProfile()
  }

  renderProfile = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({profileList: updatedData})
    }
  }

  renderProfileList = () => {
    const {profileList} = this.state
    const {name, profileImageUrl, shortBio} = profileList

    return (
      <div className="profile-container">
        <div className="profile">
          <img src={profileImageUrl} alt="profileImage" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
      </div>
    )
  }

  renderJobsApi = async () => {
    const JobsUrl = 'https://apis.ccbp.in/jobs'
    const jwtJobsToken = Cookies.get('jwt_token')

    const JobOptions = {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${jwtJobsToken} `,
      },
    }
    const response = await fetch(JobsUrl, JobOptions)
    console.log(response)
    if (response.ok === true) {
      const jobData = await response.json()
      console.log(jobData)
      const updatedJobsData = jobData.jobs.map(jobItem => ({
        companyLogoUrl: jobItem.company_logo_url,
        employmentType: jobItem.employment_type,
        id: jobItem.id,
        jobDescription: jobItem.job_description,
        location: jobItem.location,
        packagePerAnnum: jobItem.package_per_annum,
        rating: jobItem.rating,
        title: jobItem.title,
      }))
      this.setState({jobsList: updatedJobsData})
    }
  }

  renderJobs = () => {
    const {jobsList} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobsList

    return (
      <ul className="jobs-unordered">
        <img src={companyLogoUrl} alt="app" />
        <h2>{title}</h2>
        <IoMdStar />
        <p>{rating}</p>
        <ImLocation2 />
        <p>{location}</p>
        <BsFillBagFill />
        <p>{employmentType}</p>
        <p>{packagePerAnnum}</p>
        <hr />
        <p>{jobDescription}</p>
      </ul>
    )
  }

  render() {
    return (
      <div className="job-container">
        <div className="profile-container">
          <div style={{marginLeft: '38px'}}>{this.renderProfileList()}</div>
          <hr style={{marginTop: '25px', marginLeft: '38px'}} />
          <p style={{color: 'white', marginTop: '10px', marginLeft: '38px'}}>
            Type of Employment
          </p>
          <ul className="unordered">
            {employmentTypesList.map(each => (
              <li key={each.employmentTypeId} className="listed">
                <input type="checkbox" className="checkbox" />
                <label className="label-name" htmlFor={each.employmentTypeId}>
                  {each.label}
                </label>{' '}
              </li>
            ))}
          </ul>
          <hr style={{marginTop: '25px', marginLeft: '38px'}} />
          <p style={{color: 'white', marginTop: '10px', marginLeft: '38px'}}>
            Salary Range
          </p>
          <ul className="unordered">
            {salaryRangesList.map(each => (
              <li key={each.salaryRangeId} className="listed">
                <input type="checkbox" />
                <label className="label-name" htmlFor={each.salaryRangeId}>
                  {each.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-container">
          <div className="search-box">
            <input type="search" className="search-bar" placeholder="Search" />
            <div className="search">
              <FcSearch className="search-icon" />
            </div>
          </div>
          <ul>{this.renderJobs()}</ul>
        </div>
      </div>
    )
  }
}
export default JobsRoute
