from flask import Flask, render_template, jsonify, request
import pickle
import requests

app = Flask(__name__)

movies = pickle.load(open('movies.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

OMDB_API_KEY = "c09a520b"

def fetch_poster(title):
    try:
        url = f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}"
        response = requests.get(url, timeout=5)
        data = response.json()
        poster = data.get('Poster')
        if poster and poster != "N/A":
            return poster
        return "/static/no-poster.png"
    except:
        return "/static/no-poster.png"

def recommend(movie):
    try:
        movie_index = movies[movies['title'] == movie].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:9]
        recommended = []
        for i in movies_list:
            title = movies.iloc[i[0]].title
            poster = fetch_poster(title)
            recommended.append({"title": title, "poster": poster})
        return recommended
    except:
        return []
    
    app.jinja_env.globals.update(enumerate=enumerate)

@app.route('/')
def home():
    movie_list = sorted(movies['title'].values.tolist())
    return render_template('index.html', movies=movie_list)

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    movie_name = data.get('movie')
    results = recommend(movie_name)
    return jsonify(results)

@app.route('/movies')
def movies_page():
    movie_list = sorted(movies['title'].values.tolist())
    return render_template('movies.html', movies=movie_list)

@app.route('/genres')
def genres_page():
    return render_template('genres.html')

@app.route('/trending')
def trending_page():
    return render_template('trending.html')

@app.route('/toprated')
def toprated_page():
    return render_template('toprated.html')

@app.route('/about')
def about_page():
    return render_template('about.html')

@app.route('/contact')
def contact_page():
    return render_template('contact.html')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)