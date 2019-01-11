import React from "react";
import UserHeader from "./Header";
import AppNavigation from "./Navigation";
import firebase, {db} from "./firebase";
import RecipeForm from "./RecipeForm";

// import {NavLink} from "react-router-dom";


class EditRecipe extends React.Component {
    // state = {
    //     recipeName: this.props.recipe.recipeName,
    //     recipeDesc: this.props.recipe.recipeDesc,
    //     recipeInst: this.props.recipe.recipeInst,
    //     recipeIngr: this.props.recipe.recipeIngr,
    //     id: this.props.recipe.id,
    //     // TODO: need current instructions / ingredients array from RecipeForm
    //     // instructions: this.props.recipe.instructions
    // };

    state = {
        recipeName: '',
        recipeDesc: '',
        recipeInst: '',
        recipeIngr: '',
        instructions: [],
        ingredients: [],
        id: ''
    };

    getDataFromDb = () => {
        const recipeId = this.props.match.params.value;

        db.collection('Recipes').doc(recipeId).get().then(recipe => {
            const editedRecipe = recipe.data();
            console.log(editedRecipe);
            this.setState({
                recipeName: editedRecipe.recipeName,
                recipeDesc: editedRecipe.recipeDesc,
                instructions: editedRecipe.instructions,
                ingredients: editedRecipe.ingredients,
                id: recipeId
            });

        }).catch(error => console.log('Error getting data: ' + error));

    };

    handleSubmit = (instructions, ingredients) => {
        db.collection('Recipes').doc(this.state.id).set({
            recipeName: this.state.recipeName,
            recipeDesc: this.state.recipeDesc,
            instructions: instructions,
            ingredients: ingredients
        }).then(() => {
            // TODO: ADD SUCCESS MESSAGE IN HTML
            console.log('Recipe successfully updated');
        }).catch(error => console.log('Error writing document: ', error));
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    setProperty = (name, value) => () => {
        this.setState({
            [name]: value
        });
    };

    render() {
        let result;

        if (this.state.instructions.length > 0 && this.state.ingredients.length > 0) {
            result = (
                <div className="mainAppView">
                    <UserHeader/>
                    <div style={{display: 'flex'}}>
                        <AppNavigation/>
                        <RecipeForm state={this.state}
                                    handleChange={this.handleChange}
                                    handleSubmit={this.handleSubmit}
                                    setProperty={this.setProperty}
                                    isEdit={true}
                            // then if isEdit=true in componentDidMount use props below
                            //         instructions={this.props.recipe.instructions}
                            //         ingredients={this.props.recipe.ingredients}
                        />
                    </div>
                </div>
            );
        } else {
            // TODO: ADD LOADER HERE
            result = <div>LOADING</div>;
        }


        return result;
    }

    componentDidMount() {
        this.getDataFromDb();
    }
}

export default EditRecipe;