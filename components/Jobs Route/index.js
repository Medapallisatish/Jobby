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
    EmployList: [],
    selectedSalaryRangeId: '',
  }

  componentDidMount() {
    this.renderProfile()
    this.renderJobsApi()
  }

  searchBox = event => {
    this.setState({searchInput: event.target.value})
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
          <h1 style={{color: 'blue+  '}}>{name}</h1>
          <p style={{color: 'black'}}>{shortBio}</p>
        </div>
      </div>
    )
  }

  renderJobsApi = async () => {
    const {EmployList, selectedSalaryRangeId, searchInput} = this.state
    const JobsUrl = `https://apis.ccbp.in/jobs?employment_type=${EmployList}&package_per_annum=${selectedSalaryRangeId}&search=${searchInput}`
    const jwtJobsToken = Cookies.get('jwt_token')

    const JobOptions = {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${jwtJobsToken} `,
      },
    }
    const response = await fetch(JobsUrl, JobOptions)
    if (response.ok === true) {
      const jobData = await response.json()
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

  EmployLists = event => {
    const {EmployList} = this.state
    const CheckboxNotInLists = EmployList.filter(
      each => each === event.target.id,
    )
    if (CheckboxNotInLists.length === 0) {
      this.setState(
        prevState => ({
          EmployList: [...prevState.EmployList, event.target.id],
        }),
        this.renderJobsApi,
      )
    } else {
      const filterData = EmployList.filter(each => each !== event.target.id)
      this.setState(
        {
          EmployList: filterData,
        },
        this.renderJobsApi,
      )
    }
  }

  SalaryLists = event => {
    const {selectedSalaryRangeId} = this.state
    const salaryRangeId = event.target.id
    const isChecked = event.target.checked

    if (isChecked) {
      this.setState({selectedSalaryRangeId: salaryRangeId}, this.renderJobsApi)
    } else {
      this.setState({selectedSalaryRangeId: ' '}, this.renderJobsApi)
    }
  }

  buttonSearch = () => {
    this.renderJobsApi()
  }

  searchInputDown = event => {
    if (event.key === 'Enter') {
      this.renderJobsApi()
    }
  }

  render() {
    const {jobsList, searchInput, selectedSalaryRangeId} = this.state
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
                  onChange={this.EmployLists}
                  value={each.label}
                  type="checkbox"
                  className="checkbox"
                  id={each.employmentTypeId}
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
                  type="radio"
                  value={each.salaryRangeId} // Update value prop
                  checked={selectedSalaryRangeId === each.salaryRangeId}
                  onChange={this.SalaryLists}
                  id={each.salaryRangeId}
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
              value={searchInput}
              onChange={this.searchBox}
              onKeyDown={this.searchInputDown}
            />
            <button
              className="search"
              onClick={this.buttonSearch}
              type="button"
              data-testid="searchButton"
              aria-label="Search"
            >
              <FcSearch className="search-icon" />
            </button>
          </div>
          <ul>
            {jobsList.map(jobItem => (
              <li value={this.SalaryList} className="list-jobdetails">
                <div className="container">
                  <img
                    src={jobItem.companyLogoUrl}
                    alt="job details company logo"
                    className="job-image"
                  />
                  <div className="title-rating">
                    <h1>{jobItem.title}</h1>
                    <div className="star-rating">
                      <IoMdStar className="star" />
                      <p>{jobItem.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="location-employment">
                  <div className="loc-emp">
                    <ImLocation2 />
                    <p style={{marginLeft: '8px'}}>{jobItem.location}</p>

                    <BsFillBagFill style={{marginLeft: '13px'}} />
                    <p style={{marginLeft: '8px'}}>{jobItem.employmentType}</p>
                  </div>
                  <p>{jobItem.packagePerAnnum}</p>
                </div>
                <hr />
                <h2 style={{marginTop: '10px'}}>Description</h2>
                <p style={{marginTop: '10px'}}>{jobItem.jobDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
export default JobsRoute
