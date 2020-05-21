import vuetify from '../plugins/vuetify';

import axios from 'axios';

export const app = {
	el: '#app',
	name: "Nutrition",
	props: {
    },
	vuetify,
	data: {
		searchFood: '',
		urlBase: 'https://fs2.tvoydnevnik.com/api2/',
		foodList: [],
		result: {},
		drawer: false,
		model: 1
	},
	methods: {
		async searchHandler() {
			let bodyFormData = new FormData();
			bodyFormData.set('query[count_on_page]', 25);
			bodyFormData.set('query[page]', 1);
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
			this.foodList = [...this.result.data.result.list];
		}
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
					:md="4"
					class="text-ыефке">
					<form>
					  <v-text-field
						  v-model="searchFood"
						  @input="searchHandler"
						  label="Еда"
						  required
						></v-text-field>
					  <v-btn class="mr-4" @click="searchHandler">Спиок</v-btn>
					  <v-btn @click="foodList=[]">clear</v-btn>
					</form>
					<v-list>
					  <v-list-item-group>
						<v-list-item
						  v-for="(description, i) in foodList"
						  :key="description.name"
						>
						  <v-list-item-icon>
							<v-icon v-text=""></v-icon>
						  </v-list-item-icon>
						  <v-list-item-content>
							<v-list-item-title v-text="description.food.name"></v-list-item-title>
						  </v-list-item-content>
						</v-list-item>
					  </v-list-item-group>
					</v-list>
				  </v-col>
				  <v-col
					:md="8">
				  
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

// :onChange="searchHandler" :value="searchFood"
template: `
		<div>
			<form 
				name="searchForm"
				action="#" 
				@submit.prevent="searchHandler"
			>
				<input 
					name="searchInput"
					type="text" 
					v-model="searchFood"
				/>
				<input 
					name="search_btn"
					type="submit" 
					/>
			</form>
			<ul>
				<li v-for="description of foodList" >
					{{description.food? description.food.name : ''}}
				</li>
			</ul>
			
		</div>
	// `