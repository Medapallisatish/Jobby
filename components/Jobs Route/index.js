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
  state = {
    profileList: [],
    jobsList: [],
    searchInput: '',
    selectedEmploymentTypes: [],
  }

  componentDidMount() {
    this.renderProfile()
    this.renderJobsApi()
  }

  searchBox = event => {
    this.setState({searchInput: event.target.value})
  }

  filterJobs = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const {jobsList, selectedEmploymentTypes} = prevState
      let filteredJobs = [...jobsList]

      if (checked) {
        filteredJobs = filteredJobs.filter(
          jobItem => jobItem.employmentType === value,
        )
      } else {
        filteredJobs = filteredJobs.filter(
          jobItem => jobItem.employmentType !== value,
        )
      }

      const updatedSelectedEmploymentTypes = checked
        ? [...selectedEmploymentTypes, value]
        : selectedEmploymentTypes.filter(type => type !== value)

      return {
        selectedEmploymentTypes: updatedSelectedEmploymentTypes,
        jobsList: filteredJobs,
      }
    })
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
          <h1 style={{color: '#4f46e5'}}>{name}</h1>
          <p style={{color: '#7e858e'}}>{shortBio}</p>
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

  render() {
    const {searchInput, selectedEmploymentTypes, jobsList} = this.state

    let filteredJobs = [...jobsList]

    if (selectedEmploymentTypes.length > 0) {
      filteredJobs = filteredJobs.filter(jobItem =>
        selectedEmploymentTypes.includes(jobItem.employmentTypeId),
      )
    }

    const FilteredList = filteredJobs.filter(jobItem =>
      jobItem.title.toLowerCase().includes(searchInput.toLowerCase()),
    )

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
                <input
                  type="checkbox"
                  className="checkbox"
                  value={each.employmentTypeId}
                  onChange={this.filterJobs}
                />
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
                <input
                  type="checkbox"
                  onChange={this.filterJobs}
                  value={this.selectedEmploymentTypes}
                />
                <label className="label-name" htmlFor={each.salaryRangeId}>
                  {each.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="search-container">
          <div className="search-box">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={this.searchBox}
              value={this.searchInput}
            />
            <div className="search">
              <FcSearch className="search-icon" />
            </div>
          </div>
          <ul>
            {FilteredList.map(jobItem => (
              <li key={jobItem.id} className="list-jobdetails">
                <div className="heading-container">
                  <img
                    src={jobItem.companyLogoUrl}
                    alt="job details company logo"
                    className="job-image"
                  />
                  <div className="heading-rating">
                    <h1>{jobItem.title}</h1>
                    <div className="star-container">
                      <IoMdStar className="star" />
                      <p>{jobItem.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="package">
                  <div className="loc-emp">
                    <ImLocation2 />
                    <p style={{marginLeft: '5px'}}>{jobItem.location}</p>

                    <BsFillBagFill style={{marginLeft: '12px'}} />

                    <p style={{marginLeft: '5px'}}>{jobItem.employmentType}</p>
                  </div>
                  <p style={{marginTop: '15px'}}>{jobItem.packagePerAnnum}</p>
                </div>
                <hr />
                <h2 style={{marginTop: '15px'}}>Description</h2>
                <p style={{marginTop: '15px'}}>{jobItem.jobDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
export default JobsRoute
