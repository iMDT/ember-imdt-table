import Ember from 'ember';

var names = ("Ingeborg Jim Rigoberto Ian Wei Otilia Wendell Chasity " +
  "Billi Chester Omer Paulene Hiram Laurice Deneen Chuck Petrina Lamonica " +
  "Roy Ai Marsha Kiana Tamar Fabiola Travis Mazie Dawna Fe Tommye Jene").split(' ');

var surnames = ("Brown Smith Patel Jones Williams Johnson Taylor Thomas " +
  "Roberts Khan Lewis Jackson Clarke James Phillips Wilson Ali Mason " +
  "Mitchell Rose Davis Davies Rodríguez Cox Alexander " +
  "Stewart Quinn Robinson Murphy Graham").split(' ');

var cities = ["Shanghai", "Karachi", "Beijing", "Tianjin", "Istanbul", "Lagos",
  "Guangzhou", "Mumbai", "Moscow", "Dhaka", "Cairo", "São Paulo",
  "Lahore", "Shenzhen", "Seoul", "Jakarta", "Kinshasa", "Tokyo", "Mexico City",
  "Lima", "New York City", "Bengaluru", "London", "Bangkok", "Dongguan",
  "Nanjing", "Tehran", "Shenyang", "Ahmedabad", "Bogotá"
];

const O = Ember.Object;

const {
  A
} = Ember;

var generateContent = function(recordsCount) {
  var ret = new A([]);
  for (let i = 0; i < recordsCount; i++) {
    let city = cities[Math.floor(Math.random() * (cities.length - 0 + 1)) + 0];
    ret.push(O.create({
      id: i + 1,
      firstName: names[Math.floor(Math.random() * (names.length - 0 + 1)) + 0],
      lastName: surnames[Math.floor(Math.random() * (surnames.length - 0 + 1)) + 0],
      age: Math.floor(Math.random() * (50 - 18)) + 18,
      city: city,
      cityWithHtml: `<i>${city}</i>`
    }));
  }
  return ret;
};

export default Ember.Controller.extend({
  model: generateContent(100),
  columns: new A([{
    contentPath: 'id',
    columnTitle: 'ID',
    isSortable: false,
    isSearchable: false,
  }, {
    contentPath: 'firstName',
    columnTitle: 'First Name'
  }, {
    contentPath: 'lastName',
    columnTitle: 'Last Name'
  }, {
    contentPath: 'cityWithHtml',
    columnTitle: 'City',
    sortPath: 'city'
  },
  {
    contentPath: 'age',
    columnTitle: 'Age'
  },
  {
    contentPath: 'template',
    columnTitle: 'Template',
    template: 'custom/button'
  }
]),
  sort: new A(['city:desc', 'firstName:desc', 'lastName:asc']),

  ages: Ember.computed.mapBy('content', 'age'),
  totalAge: Ember.computed.sum('ages'),

  agesByPage: Ember.computed.mapBy('pageData', 'age'),
  totalAgeByPage: Ember.computed.sum('agesByPage'),

  actions: {
    deleteRecord: function(record) {
      var content = this.get('example9.content');
      this.set('example9.content', content.without(record));
    }
  }
});
