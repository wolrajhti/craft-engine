# craft-engine

## Ingrédients
Les ingrédients peuvent être fabriqués à l'aide de recette à partir d'autres ingrédients, ou directement achetés à des producteurs.

Les ingrédients peuvent être de différentes sortes:
- périssables (fruits, légumes, ...)
- ustensiles (poêle, cuillière, ...)
- capacités (maîtrise de la cuisson des viandes, de la pâtisserie, ...)
- techniques (cuisson au bain marie, micro-onde, ...)

## Conteneurs
Les conteneurs sont les entités qui hébergent les ingrédients.

- Les périssables sont généralements dans les stocks (chambres froides, réfrigateurs, ...)
- Les ustensiles dans les meubles (étagères, rangements, ...)
- Les capacités appartiennent aux agents (cuistots, commis, caissiers, ...)
- Les techniques aux équipements (four, micro-onde, ...)

## Recettes
Les recettes précisent les ingrédients à réunir pour générer un ingrédient de sorti.

Au début de l'exécution de la recette, les ingrédients nécessaires à celle-ci sont consommés.

A la fin de l'exécution de la recette, les ingrédients générés sont produits:
- Les capacités et techniques sont restituées aux agents et équipements.
- Les ustensiles laissés sur places.
- Les denrées périssables consommées.

Certains ingrédients de sortie sont liés à des ingrédients d'entrée spécifique:
- Les capacités montent en niveau au fur et à mesure qu'elles sont employées.
- Les ustensiles sont salis et leur état se détériore au fur et à mesure.
- Les techniques des équipements

## Agents
Les agents ont en charge de déplacer les ingrédients nécessaires à l'exécution des recettes

Un agent:
- a des capacités
- est un stock (ce qui permet les mouvements entre les différents stocks immobiles)
- se déplace