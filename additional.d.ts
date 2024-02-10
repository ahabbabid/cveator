interface EducationVals {
  institute: string
  metricValue: string
  degree: string
  metric: Metrics
  location: string
  startDate: string
  endDate: string
}
interface PersonalInfoVals {
  name: string
  email: string
  phoneNumber: string
}
interface WorkExperienceVals {
  company: string
  desc: string
  location: string
  startDate: string
  endDate: string
}
interface AcademicProjectsVals {
  name: string
  desc: string
}
interface AcademicProjectsVals {
  name: string
  desc: string
}
interface FormValues {
  personalInfo: PersonalInfoVals
  address: {
    houseAddress: string
    city: string
    province: string
    country: string | 'Pakistan'
  }
  objective: string
  education: {
    
    other: Array<EducationVals>
  }
  work: Array<WorkExperienceVals>
  academicProjects: Array<AcademicProjectsVals>
  awardsAndAchievements: Array<string>
  skills: Array<string>
}
type Metrics = 'CGPA' | 'Grades' | 'Result'
declare module 'html2pdf.js'
declare module 'react-dom/server'
declare module 'file-saver'
