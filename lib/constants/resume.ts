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

const initialResumeData = (finalYear: boolean): FormValues => ({
  personalInfo: personalInfoDefaultVal,
  address: addressDefaultVals,
  objective: objectiveDefaultVal,
  education: {
    giki: {
      institute:
        'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)',
      discipline: `Computer Science`,
      cgpa: '3:00',
      location: 'Topi, PK',
      startDate: '2018',
      endDate: '2020',
    },
    other: [educationDefaultVals],
  },

  work: [workExperienceDefaultVals],
  fyp: finalYear ? FypDefaultVals : undefined,
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
