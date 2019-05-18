
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

@Template
@Component
export default class Home extends Vue {
  public entry: string = "";

  public grid: Array<Array<any>> = null as any;

  public active: boolean = false;
  public activeData: null | [ number, number ] = null;

  public created ( ): void {
    const grid: Array<Array<any>> = new Array(this.years);
    for (let year = 0; year < this.years; ++year ) {
      grid[year] = new Array(52);
      for (let week = 0; week < 52; ++week) {
        grid[year][week] = {
          active: false,
          content: null,
          _id: null,
          year, week
        };
      }
    }
    this.$set(this, "grid", grid);
    this.$store.http.get("/entries").then(( { data }: any ): void => {
      for (const entry of data) {
        const m = entry.date.match(/(\d+)-(\d+)/);
        Object.assign(this.grid[Number(m[1])][Number(m[2])], entry);
      }
    });
  }

  public yearOf ( date: string | Date ): number {
    return new Date(date).getFullYear() -
      new Date(this.$store.auth.data.dob).getFullYear();
  }

  public get years ( ): number {
    return this.yearOf(new Date());
  }

  public get weeks ( ): number {
    return Math.floor(new Date().getDate() / 7);
  }

  public createEntry ( year: number, week: number ): void {
    this.$store.http.post(`/entries/${year}-${week}`, {
      content: this.entry
    }).then(( ): void => {
      this.entry = "";
    })
  }
}
