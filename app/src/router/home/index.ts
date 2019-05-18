
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Template from "./index.pug";
import "./index.styl";

@Template
@Component
export default class Home extends Vue {
  public entry: string = "";

  public grid: Array<Array<any>> = null as any;

  public created ( ): void {
    const grid: Array<Array<any>> = new Array(this.years);
    for (let year = 0; year < this.years; ++year ) {
      grid[year] = new Array(52);
      for (let week = 0; week < 52; ++week) {
        grid[year][week] = {
          active: false,
          content: false,
          _id: null,
          year, week
        };
      }
    }
    this.$set(this, "grid", grid);
    this.$store.http.get("/entries").then(( { data }: any ): void => {
      for (const entry of data) {
        const year = this.yearOf(entry.date);
        const week = this.weekOf(entry.date);
        Object.assign(this.grid[year][week], entry);
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

  public weekOf ( date: string | Date ): number {
    return this.weekOfYear(new Date(date)) -
      this.weekOfYear(new Date(this.$store.auth.data.dob));
  }

  public weekOfYear ( d: Date ): number {
    // adapted from https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart: number = new Date(Date.UTC(d.getUTCFullYear(),0,1)).valueOf();
    return Math.ceil(( ( (d.valueOf() - yearStart) / 86400000) + 1)/7);
  }

  public get weeks ( ): number {
    return Math.floor(new Date().getDate() / 7);
  }

  public createEntry ( ): void {
    this.$store.http.post("/entries/", {
      content: this.entry
    }).then(( ): void => {
      this.entry = "";
    })
  }
}
