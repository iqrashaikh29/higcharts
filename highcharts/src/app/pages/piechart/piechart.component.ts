import { Imovies } from './../../interface/Imovies';
import { Component, OnInit } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [HighchartsChartModule, HttpClientModule],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss',
})
export class PiechartComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions!: any;
  chartOptions1!: any;
  chartOptions2!: any;
  chartOptions3!: any;
  chartOptions4!: any;
  chartOptions5!: any;
  allMovies!: Imovies[];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getChartData();
  }

  getChartData() {
    this.http.get<Imovies[]>('https://localhost:7118/api/Movies').subscribe({
      next: (res: Imovies[]) => {
        this.allMovies = res;
        // console.log(this.allMovies.length);

        this.barChart();
        this.pieChart();
        this.areaChart();
        this.lineChart();
        this.changeInRuntime();
        this.changeInAll();
      },
    });
  }
  barChart() {
    // console.log('from barchart', this.allMovies);

    const years = [...new Set(this.allMovies.map((x) => x.year))];
    // console.log(years);

    const movieCountByYear = years.map((year) => {
      return this.allMovies.filter(
        (movie) => movie.year === year && movie.type == 'movie'
      ).length;
    });

    const seriesCountByYear = years.map((year) => {
      return this.allMovies.filter(
        (series) => series.year === year && series.type == 'series'
      ).length;
    });

    // console.log('series', seriesCountByYear);
    // console.log('movie', movieCountByYear);

    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Barchart',
      },
      xAxis: {
        categories: years,
        title: {
          text: 'Years',
        },
      },
      yAxis: {
        title: {
          text: 'Number of Movies',
        },
      },
      plotOptions: {
        series: {
          borderRadius: 5,
          cursor: 'pointer',
        },
      },
      series: [
        {
          data: movieCountByYear,
          // type: 'column',
          name: 'Movies',
        },
        {
          data: seriesCountByYear,
          // type: 'column',
          name: 'Series',
        },
      ],
    };
    // console.log(this.chartOptions);
    // console.log(Highcharts);
  }

  pieChart() {
    const years = [...new Set(this.allMovies.map((x) => x.year))];
    const movieCountByYear = years.map((year) => {
      return this.allMovies.filter(
        (movie) => movie.year === year && movie.type == 'movie'
      ).length;
    });
    this.chartOptions1 = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pie Chart For Number of Movies each Year',
      },
      plotOptions: {
        series: {
          allowPointSelect: 'true',
          cursor: 'pointer',
          borderColor: 'black',
          borderWidth: 3,
        },
      },
      series: [
        {
          name: 'movie count',
          data: years.map((year, index) => ({
            name: year,
            y: movieCountByYear[index],
          })),
        },
      ],
    };
  }
  areaChart() {
    // const rating = [...this.allMovies.map((x) => x.imdbRating)];
    // console.log('ratinggggg', rating);

    const years = [...new Set(this.allMovies.map((x) => x.year))];
    console.log('Years:', years);

    // Create an object to store ratings for each year
    const ratingsByYear: { [key: number]: number[] } = {};

    // Loop through each year and extract the ratings
    years.forEach((year) => {
      const ratingsForYear = this.allMovies
        .filter((movie) => movie.year === year) // Filter movies for this year
        .map((movie) => movie.imdbRating); // Extract ratings for the year

      // Store the ratings in the object with the year as the key
      ratingsByYear[year] = ratingsForYear;
    });
    console.log('years rating', ratingsByYear);

    // console.log('Ratings by Year:', ratingsByYear);
    // Calculate the average rating for each year
    const averageRatingsByYear: { [key: number]: number } = {}; // Object for storing average ratings

    years.forEach((year) => {
      const ratingsForYear = ratingsByYear[year];

      // Calculate the sum of ratings
      const sumOfRatings = ratingsForYear.reduce((sum, rating) => sum + rating);

      // Calculate the average
      const averageRating = ratingsForYear.length
        ? sumOfRatings / ratingsForYear.length
        : 0;

      // Store the average rating in the new object
      averageRatingsByYear[year] = averageRating;
    });

    console.log('Average Ratings by Year:', averageRatingsByYear);

    const averageRatings = Object.values(averageRatingsByYear); // Data for y-axis (average ratings)
    const yearsArray = Object.keys(averageRatingsByYear).map(Number); // Data for x-axis (years)

    console.log(averageRatings);
    console.log(yearsArray);

    this.chartOptions2 = {
      chart: {
        type: 'area', // Set chart type to 'area'
      },
      title: {
        text: 'Average IMDb Ratings by Year',
      },
      xAxis: {
        categories: yearsArray, // Years on the x-axis
        title: {
          text: 'Years',
        },
      },
      yAxis: {
        title: {
          text: 'Average Rating',
        },
      },
      series: [
        {
          name: 'Average Rating', // Series name
          data: averageRatings, // Average ratings for each year
        },
      ],
    };
  }

  //genre wise average run time
  lineChart() {
    const allGenre = this.allMovies.map((x) => x.genre);
    // console.log('genres', allGenre);
    const arrayGenre = [
      ...new Set(
        allGenre.flatMap((genre) => genre.split(',').map((g) => g.trim()))
      ),
    ];
    console.log('unique genres', arrayGenre);

    const runtime: { [key: string]: number[] } = {};

    arrayGenre.forEach((genre) => {
      const runtimegenre = this.allMovies
        .filter((g) => g.genre.includes(genre))
        .map((g) => g.runtime);
      // console.log('runtime genre', runtimegenre);

      runtime[genre] = runtimegenre;
    });
    // console.log('runtime', runtime);

    const averagerutime: { [key: string]: number } = {};

    arrayGenre.forEach((genre) => {
      const runtimeForGenre = runtime[genre];
      const sumofRuntime = runtimeForGenre.reduce(
        (sum, runtime) => sum + runtime
      );
      // console.log('runtimeForGenre', runtimeForGenre);

      // console.log('sum of rating', sumofRuntime);

      const average = runtimeForGenre.length
        ? sumofRuntime / runtimeForGenre.length
        : 0;
      averagerutime[genre] = average;
    });
    // console.log('average runtime for each genre', averagerutime);

    const onlyAverage = Object.values(averagerutime);
    const onlyGenre = Object.keys(averagerutime).map(String);

    // console.log('genres', onlyGenre);
    // console.log('sverages', onlyAverage);
    this.chartOptions3 = {
      chart: {
        type: 'line',
      },
      xAxis: {
        categories: onlyGenre,
        title: {
          text: 'Genres',
        },
      },
      yAxis: {
        title: {
          text: 'Average Genre Rating',
        },
      },
      series: [
        {
          name: 'Average Runtime',
          data: onlyAverage,
          // type: 'line',
        },
      ],
    };
  }

  changeInRuntime() {
    //year on year runtimechange
    const years = [...new Set(this.allMovies.map((year) => year.year))];
    console.log('Yera', years);

    const runtimeByYear: { [key: number]: number[] } = {};

    years.forEach((year) => {
      const runtime = this.allMovies
        .filter((movie) => movie.year == year)
        .map((movie) => movie.runtime);
      runtimeByYear[year] = runtime;
    });
    // console.log(runtimeByYear);

    const averageRuntimeByYear: { [key: number]: number } = {}; // Object for storing average ratings

    years.forEach((year) => {
      const runtimeForYear = runtimeByYear[year];
      const sumOfRuntime = runtimeForYear.reduce(
        (sum, runtime) => sum + runtime
      );

      const averageRuntime = runtimeForYear.length
        ? sumOfRuntime / runtimeForYear.length
        : 0;

      averageRuntimeByYear[year] = averageRuntime;
    });

    // console.log('Average Runtime by Year:', averageRuntimeByYear);

    const changeByYear = years.map((year, index) => {
      if (index > 0) {
        const previousYear = years[index - 1];
        const currentAverage = averageRuntimeByYear[year];
        const previousAverage = averageRuntimeByYear[previousYear];

        return ((currentAverage - previousAverage) / previousAverage) * 100; // Calculate percentage change
      } else {
        return 0; // Handle the first year (no previous data)
      }
    });
    // console.log('change', changeByYear);

    this.chartOptions4 = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Average Runtime Change by Year',
      },
      xAxis: {
        categories: years,
        title: {
          text: 'Years',
        },
      },
      yAxis: {
        title: {
          text: 'Percentage Change',
        },
      },
      series: [
        {
          name: 'Runtime Change',
          data: changeByYear,
          type: 'area',
        },
      ],
    };
  }

  changeInAll() {
    //genre and lang runtime change on year

    const years = [...new Set(this.allMovies.map((year) => year.year))];
    console.log('Years:', years);

    const runtimeByGenreLang: { [key: string]: { [key: string]: number[] } } =
      {};

    this.allMovies.forEach((movie) => {
      const genres = movie.genre.split(',').map((g) => g.trim());
      const language = movie.language;

      genres.forEach((genre) => {
        if (!runtimeByGenreLang[genre]) {
          runtimeByGenreLang[genre] = {};
        }

        if (!runtimeByGenreLang[genre][language]) {
          runtimeByGenreLang[genre][language] = [];
        }

        if (movie.runtime !== undefined) {
          runtimeByGenreLang[genre][language].push(movie.runtime);
        }
      });
    });

    // console.log('runtime by genre and language:', runtimeByGenreLang);

    const averageRuntimeByYear: { [key: string]: { [key: string]: number } } =
      {};

    for (const genre in runtimeByGenreLang) {
      averageRuntimeByYear[genre] = {}; // Initialize the genre object to avoid undefined
      for (const language in runtimeByGenreLang[genre]) {
        const runtimeData = runtimeByGenreLang[genre][language];
        const averageRuntime =
          runtimeData.length > 0
            ? runtimeData.reduce((sum, runtime) => sum + runtime) /
              runtimeData.length
            : 0;
        averageRuntimeByYear[genre][language] = averageRuntime;
      }
    }

    console.log('average', averageRuntimeByYear);

    const categories: string[] = []; // To store the genre-language-year combinations
    const runtimeData: number[] = []; // To store the average runtime for each combination

    // Loop through the averageRuntimeByYear object to construct the x-axis categories and y-axis runtime data
    for (const genre in averageRuntimeByYear) {
      for (const language in averageRuntimeByYear[genre]) {
        for (const year of years) {
          console.log(year);
          // console.log(genre);

          const averageRuntime = averageRuntimeByYear[genre][language];
          // Combine genre, language, and year into a single string for the x-axis category
          const category = `${genre} - ${language} -${year}`;
          categories.push(category); // Push this combination to the categories array
          runtimeData.push(averageRuntime); // Push the corresponding average runtime to runtimeData array
        }
      }
    }

    this.chartOptions5 = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Average Runtime by Genre, Language, and Year',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Genre - Language - Year',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Average Runtime (minutes)',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        valueSuffix: ' minutes',
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Average Runtime',
          data: runtimeData,
        },
      ],
    };
  }
}
