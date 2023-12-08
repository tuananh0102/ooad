class PublishJobForm {
  constructor(
    title,
    description,
    requirements,
    tags,
    startTime,
    endTime,
    salary,
    typeOfWorking,
    gender,
    positions,
    slots,
    exp,
    benefits,
    imageUrl
  ) {
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.tags = tags;
    this.startTime = startTime;
    this.endTime = endTime;
    this.salary = salary;
    this.typeOfWorking = typeOfWorking;
    this.gender = gender;
    this.positions = positions;
    this.slots = slots;
    this.exp = exp;
    this.benefits = benefits;
    this.imageUrl = imageUrl;
  }

  validate() {
    if (
      this.title &&
      this.description &&
      this.requirements &&
      this.tags &&
      this.startTime &&
      this.endTime &&
      this.salary &&
      this.typeOfWorking &&
      this.gender &&
      this.positions &&
      this.slots &&
      this.exp &&
      this.benefits &&
      this.imageUrl
    ) {
      return true;
    }

    return false;
  }
}

export default PublishJobForm;
