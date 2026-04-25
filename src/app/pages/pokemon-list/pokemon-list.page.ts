import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
})
export class PokemonListPage implements OnInit {
  pokemons: any[] = [];
  loading = false;
  searchResult: any = null;
  searchError: string = '';
  isPlayingCry = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(50).subscribe({
      next: (response) => {
        this.pokemons = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching Pokémon:', error);
        this.loading = false;
      },
    });
  }

  searchPokemon(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      this.clearSearch();
      return;
    }

    this.loading = true;
    this.searchError = '';

    this.pokemonService.getPokemonDetails(searchTerm).subscribe({
      next: (response) => {
        this.searchResult = {
          id: response.id,
          order: response.order,
          name: response.name,
          species: response.species?.name,
          image: response.sprites.other['official-artwork'].front_default || response.sprites.front_default,
          shinyImage: response.sprites.front_shiny,
          backImage: response.sprites.back_default,
          shinyBackImage: response.sprites.back_shiny,
          types: response.types.map((t: any) => t.type.name).join(', '),
          abilities: response.abilities
            .map((a: any) => `${a.ability.name}${a.is_hidden ? ' (oculta)' : ''}`)
            .join(', '),
          forms: response.forms.map((f: any) => f.name).join(', '),
          hp: response.stats.find((s: any) => s.stat.name === 'hp')?.base_stat,
          attack: response.stats.find((s: any) => s.stat.name === 'attack')?.base_stat,
          defense: response.stats.find((s: any) => s.stat.name === 'defense')?.base_stat,
          specialAttack: response.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat,
          specialDefense: response.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat,
          speed: response.stats.find((s: any) => s.stat.name === 'speed')?.base_stat,
          movesCount: response.moves?.length || 0,
          gameIndicesCount: response.game_indices?.length || 0,
          heldItemsCount: response.held_items?.length || 0,
          isDefault: response.is_default ? 'Si' : 'No',
          height: response.height,
          weight: response.weight,
          baseExperience: response.base_experience,
          cry: response.cries?.legacy || response.cries?.latest || null,
        };
        this.loading = false;
      },
      error: (error) => {
        this.searchError = 'Pokémon no encontrado. Intenta con otro nombre.';
        this.searchResult = null;
        this.loading = false;
        console.error('Error fetching Pokémon details:', error);
      },
    });
  }

  clearSearch() {
    this.searchResult = null;
    this.searchError = '';
  }

  playCry() {
    if (!this.searchResult.cry) {
      console.warn('Cry no disponible para este Pokémon');
      return;
    }

    this.isPlayingCry = true;
    const audio = new Audio(this.searchResult.cry);
    
    audio.onended = () => {
      this.isPlayingCry = false;
    };
    
    audio.onerror = () => {
      console.error('Error reproduciendo el cry');
      this.isPlayingCry = false;
    };
    
    audio.play().catch((error) => {
      console.error('Error al reproducir:', error);
      this.isPlayingCry = false;
    });
  }
}