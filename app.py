# from flask import Flask, render_template, jsonify, request
# import pickle
# import requests

# app = Flask(__name__)

# movies = pickle.load(open('movies.pkl', 'rb'))
# similarity = pickle.load(open('similarity.pkl', 'rb'))

# OMDB_API_KEY = "c09a520b"

# def fetch_poster(title):
#     try:
#         url = f"http://www.omdbapi.com/?t={title}&apikey={OMDB_API_KEY}"
#         response = requests.get(url, timeout=5)
#         data = response.json()
#         poster = data.get('Poster')
#         if poster and poster != "N/A":
#             return poster
#         return "/static/no-poster.png"
#     except:
#         return "/static/no-poster.png"

# def recommend(movie):
#     try:
#         movie_index = movies[movies['title'] == movie].index[0]
#         distances = similarity[movie_index]
#         movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:9]
#         recommended = []
#         for i in movies_list:
#             title = movies.iloc[i[0]].title
#             poster = fetch_poster(title)
#             recommended.append({"title": title, "poster": poster})
#         return recommended
#     except:
#         return []
    
#     app.jinja_env.globals.update(enumerate=enumerate)

# @app.route('/')
# def home():
#     movie_list = sorted(movies['title'].values.tolist())
#     return render_template('index.html', movies=movie_list)

# @app.route('/recommend', methods=['POST'])
# def get_recommendations():
#     data = request.get_json()
#     movie_name = data.get('movie')
#     results = recommend(movie_name)
#     return jsonify(results)

# @app.route('/movies')
# def movies_page():
#     movie_list = sorted(movies['title'].values.tolist())
#     return render_template('movies.html', movies=movie_list)

# @app.route('/genres')
# def genres_page():
#     return render_template('genres.html')

# @app.route('/trending')
# def trending_page():
#     return render_template('trending.html')

# @app.route('/toprated')
# def toprated_page():
#     return render_template('toprated.html')

# @app.route('/about')
# def about_page():
#     return render_template('about.html')

# @app.route('/contact')
# def contact_page():
#     return render_template('contact.html')

# if __name__ == '__main__':
#     import os
#     port = int(os.environ.get('PORT', 5000))
#     app.run(host='0.0.0.0', port=port, debug=False)


from flask import Flask, render_template, jsonify, request
import pickle
import requests
import os
import gdown

app = Flask(__name__)

MOVIES_FILE_ID = "1aHhM_yMwNDRVFQZIg5e3mzJnTTu08wJb"
SIMILARITY_FILE_ID = "1tCbwik_ssEVQktsoro3hClR85oNe_3Oe"

if not os.path.exists('movies.pkl'):
    print("Downloading movies.pkl...")
    gdown.download(f"https://drive.google.com/uc?id={MOVIES_FILE_ID}", 'movies.pkl', quiet=False)

if not os.path.exists('similarity.pkl'):
    print("Downloading similarity.pkl...")
    gdown.download(f"https://drive.google.com/uc?id={SIMILARITY_FILE_ID}", 'similarity.pkl', quiet=False)

movies = pickle.load(open('movies.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

TMDB_API_KEY = os.environ.get('TMDB_API_KEY', 'tumhari_local_key')

def fetch_poster(title):
    try:
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={title}"
        response = requests.get(search_url, timeout=5)
        data = response.json()
        results = data.get('results', [])
        if results and results[0].get('poster_path'):
            return f"https://image.tmdb.org/t/p/w500{results[0]['poster_path']}"
        return f"https://via.placeholder.com/300x450/141414/888?text={title.replace(' ', '+')}"
    except:
        return "https://via.placeholder.com/300x450/141414/888?text=No+Poster"

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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)