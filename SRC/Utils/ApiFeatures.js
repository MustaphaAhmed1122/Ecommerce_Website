class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  paginate() {
    let { page, size } = this.queryData;
    if (!page || page <= 0) {
      page = 1;
    }
    if (size < 0 || !size) {
      size = 3;
    }
    this.mongooseQuery
      .limit(parseInt(size))
      .skip(parseInt(page - 1) * parseInt(size));
    return this;
  }
  filter() {
    const excludeQueryParams = ["size", "page", "search", "fields", "sort"];
    const fiterQuery = { ...this.queryData };
    excludeQueryParams.forEach((param) => {
      delete fiterQuery[param];
    });
    this.mongooseQuery.find(
      JSON.parse(
        JSON.stringify(fiterQuery).replace(
          /(gt|gte|lt|lte|in|nin|eq|neq)/g,
          (match) => `$${match}`
        )
      )
    );
    return this;
  }
  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "));
    return this;
  }
  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: "i" } },
          { description: { $regex: this.queryData.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
  select() {
    this.mongooseQuery.select(this.queryData.fields?.replaceAll(",", " "));
    return this;
  }
}

export default ApiFeatures;
