const educationDefaultVals: EducationVals = {
  institute: 'Institute',
  degree: 'Qualification',
  location: 'City, Country',
  endDate: 'End Date',
  startDate: 'Start Date',
  metric: 'Grades',
  metricValue: '3 As',
}
const academicProjectsDefaultVals: AcademicProjectsVals = {
  name: 'Name of your project',
  desc: 'Description of your project',
}
const FypDefaultVals: AcademicProjectsVals = {
  name: 'FYP Name',
  desc: 'FYP description',
}
const workExperienceDefaultVals: WorkExperienceVals = {
  startDate: 'Start Date',
  endDate: 'End Date',
  company: 'Company Name',
  desc: 'Small description of the work you did',
  location: 'City, Country',
}
const skillDefaultVal: string = 'Skill'
const awardsAndAchievementsDefaultVal: string = 'Award/Acheivment'
const addressDefaultVals = {
  houseAddress: '52nd Street',
  city: 'Lahore',
  province: 'Punjab',
  country: 'Pakistan',
}

const objectiveDefaultVal =
  'a small description of what you wish to acheive with this resume'
const personalInfoDefaultVal = {
  name: 'Your Name Here',
  email: 'example@example.com',
  phoneNumber: '+92 (300) 000000',
}

const initialResumeData = (): FormValues => ({
  personalInfo: personalInfoDefaultVal,
  address: addressDefaultVals,
  objective: objectiveDefaultVal,
  education: {
    other: [educationDefaultVals],
  },
  work: [workExperienceDefaultVals],
  academicProjects: [academicProjectsDefaultVals],
  awardsAndAchievements: [awardsAndAchievementsDefaultVal],
  skills: [skillDefaultVal],
})
const defaultVals = {
  personalInfo: personalInfoDefaultVal,
  education: educationDefaultVals,
  awardsAndAchievements: awardsAndAchievementsDefaultVal,
  skills: skillDefaultVal,
  academicProjects: academicProjectsDefaultVals,
  address: addressDefaultVals,
  work: workExperienceDefaultVals,
  objective: objectiveDefaultVal,
  fyp: FypDefaultVals,
}

export {
  workExperienceDefaultVals,
  academicProjectsDefaultVals,
  educationDefaultVals,
  awardsAndAchievementsDefaultVal,
  skillDefaultVal,
  initialResumeData,
  defaultVals,
}
