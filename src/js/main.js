import vuetify from '../plugins/vuetify';

import axios from 'axios';

import {nutrientsTitles} from './nutrients-abriviatures';

export const app = {
	el: '#app',
	name: "Nutrition",
	props: {
    },
	vuetify,
	data: {
		searchFood: '', // поле "добавить"
		lastSearch: '',
		urlBase: 'https://fs2.tvoydnevnik.com/api2/',
		foodList: [],//массив с продуктами
		table: [],//массив продуктов на столе
		result: {}, // полный ответ от сервера
		drawer: false,
		focusedItem: null,
		icon: 'add',
		isLoading: false,
		next: null, //для пагинации в листе "добавить"
		nutrientsTitles,	
	},
	filters: {
		//Удаляет название категории продукта, если есть таковое в его названии
		shortName: function(value){
			const hasGroupName = value.indexOf('[') !== -1
			// console.log(hasGroupName)
			const name = hasGroupName 
						?
						value.substring(0, value.indexOf('['))
						:
						value
			return name;
		},
		//БЖУ подпись в списке "добавить"
		PFCtitles: function(nutrientsShort){ 
			let title = '';
			for(let id in nutrientsShort){
				title += `${nutrientsTitles[id].nameShort}: ${nutrientsShort[id]} ${nutrientsTitles[id].unit}`;
				title += ' ';
			}
			return title;
		}
	},
	methods: {
		async searchHandler() {
			this.isLoading = true;
			// console.log('current ', this.searchFood);
			// console.log('last ', this.lastSearch);
			if(this.searchFood !== this.lastSearch){
				this.foodList = [];
				this.next = null;
			}
			if(this.searchFood){
				this.lastSearch = this.searchFood;
				this.next = this.next || 1;
				let bodyFormData = new FormData();
				bodyFormData.set('query[count_on_page]', 25);
				bodyFormData.set('query[page]', this.next);
				bodyFormData.set('query[name]', this.searchFood);
				this.result = await axios({
					method: 'post',
					url: `${this.urlBase}food_search/searchTable`,
					data: bodyFormData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'Accept': 'application/json'					
						}
				});
				const {pages} = this.result.data.result;
				this.next = pages >= this.next ? ++this.next : null
				this.isLoading = false;
				this.foodList = this.foodList.concat(this.result.data.result.list.map(item=>{
					return {
						name: item.food.name,
						nutrientsShort: item.food.nutrientsShort,
						props: JSON.parse(item.food.props)
					}
				}));
			}else{
				this.isLoading = false;
				this.foodList = [];
			}
		},
		moreHandler(){
			this.searchHandler();
		},
		tableAddHandler(e){
			const foodAdd = this.foodList[e.currentTarget.dataset.id];
			foodAdd.weight = '100';
			this.table.push(foodAdd)
			this.searchFood = '';
			this.foodList = [];
			// this.table.push(this.foodList[e.currentTarget.dataset.id]);
		}
	},
	mounted(){
		// console.log(this.nutrientsTitles);
	},
	template: `
		<v-app id="inspire">
			<v-navigation-drawer
			  v-model="drawer"
			  app
			  right
			>
			  <v-list dense>
				<v-list-item link>
				  <v-list-item-action>
					<v-icon>mdi-home</v-icon>
				  </v-list-item-action>

				  <v-list-item-content>
					<v-list-item-title>Home</v-list-item-title>
				  </v-list-item-content>
				</v-list-item>

				<v-list-item link>
				  <v-list-item-action>
					<v-icon>mdi-contact-mail</v-icon>
				  </v-list-item-action>

				  <v-list-item-content>
					<v-list-item-title>Contact</v-list-item-title>
				  </v-list-item-content>
				</v-list-item>
			  </v-list>
			</v-navigation-drawer>

			<v-app-bar
			  app
			  color="cyan"
			  dark
			>
			  <v-spacer></v-spacer>

			  <v-toolbar-title>Nutrition balance</v-toolbar-title>

			  <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			</v-app-bar>

			<v-content>
			  <v-container
				class="fill-height"
				fluid
			  >
				<v-row
				  align="start"
				  justify="center"
				  :lg="12"
				  class="fill-height"
				>
				  <v-col
					:md="8">
					<v-simple-table>
						<template v-slot:default>
						  <thead>
							<tr>
							  <th class="text-left">Еда</th>
							  <th class="text-left">{{nutrientsTitles['11'].name}}</th>
							  <th class="text-left">{{nutrientsTitles['13'].name}}, {{nutrientsTitles['13'].unit}}</th>
							  <th class="text-left">{{nutrientsTitles['14'].name}}, {{nutrientsTitles['14'].unit}}</th>
							  <th class="text-left">{{nutrientsTitles['15'].name}}, {{nutrientsTitles['15'].unit}}</th>
							  <th class="text-left">Сколько</th>
							  <th class="text-left"></th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-for="food in table" :key="food.id"
								v-if="table.length"
							>
							  <td>
								<b> {{food.name}} </b>
							  </td>
							  <td>{{ food.nutrientsShort['11'] }}</td>
							  <td>{{ food.nutrientsShort['13'] }}</td>
							  <td>{{ food.nutrientsShort['14'] }}</td>
							  <td>{{ food.nutrientsShort['15'] }}</td>
							  <td>{{ food.weight }}</td>
							  <td><v-icon>mdi-close</v-icon></td>
							</tr>
						  </tbody>
						</template>
					  </v-simple-table>
				  </v-col>
				  <v-col
					:md="4"
					class="text-start">
					<form @submit.prevent="">
					  <v-text-field
						  v-model="searchFood"
						  @input="searchHandler"
						  label="Ввод тут"
						  append-icon="mdi-close"
						></v-text-field>
					</form>
					<div v-show="!searchFood.length">
						<v-chip outlined>
							Напиши название еды
						</v-chip>
					</div>
					<div v-show="isLoading">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
							<circle cx="84" cy="50" r="5.52767" fill="#5bcde1">
								<animate attributeName="r" repeatCount="indefinite" dur="0.25s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>
								<animate attributeName="fill" repeatCount="indefinite" dur="1s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#5bcde1;#8849d3;#119bf7;#6160f4;#5bcde1" begin="0s"></animate>
							</circle><circle cx="31.2059" cy="50" r="10" fill="#5bcde1">
							  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
							  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>
							</circle><circle cx="65.2059" cy="50" r="10" fill="#6160f4">
							  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
							  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.25s"></animate>
							</circle><circle cx="16" cy="50" r="0" fill="#119bf7">
							  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
							  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5s"></animate>
							</circle><circle cx="16" cy="50" r="4.47233" fill="#8849d3">
							  <animate attributeName="r" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
							  <animate attributeName="cx" repeatCount="indefinite" dur="1s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.75s"></animate>
							</circle>
						</svg>
					</div>
					<v-list 
						class="overflow-y-auto overflow-x-auto"
						style="max-height: 350px"
						v-if="!isLoading"
						>
					<v-list-item three-line
					  v-for="(food, i) in foodList"
					  :key="food.props.id"
					>
					  <v-list-item-content>
						<v-list-item-title>
							<b> {{food.name|shortName}} </b>
						</v-list-item-title>
						<v-list-item-subtitle>
							<b>{{food.props.name_group}}</b>  
						</v-list-item-subtitle>
						<v-list-item-subtitle>
						  {{food.nutrientsShort|PFCtitles}}
						</v-list-item-subtitle>
					  </v-list-item-content>
					  <v-btn fab small depressed rigth
						color="cyan lighten-4"
						dark
						:data-id="i"
						@click="tableAddHandler"
					  >
							<v-icon>mdi-plus</v-icon>
					  </v-btn>
					</v-list-item>
					  <v-list-item
						v-show="next && searchFood.length">
						<v-list-item-content>
							<a href="#"
								@click.prevent="moreHandler">
								Ещё
							</a>
						</v-list-item-content>
					  </v-list-item>
					</v-list>
				  </v-col>
				</v-row>
			  </v-container>
			</v-content>

			<v-footer
			  color="cyan"
			  app
			>
			  <v-spacer></v-spacer>

			  <span class="white--text">&copy; 2019</span>
			</v-footer>
		  </v-app>
	`
};