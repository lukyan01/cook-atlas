# CookAtlas Frontend Development Context

## Project Overview
CookAtlas is a recipe aggregation and discovery platform that consolidates content from external sources like YouTube, food blogs, and Instagram. It allows users to search for recipes based on different criteria such as preparation time, difficulty, ingredients, equipment, and dietary needs. Future enhancements include community contributions (ratings, reviews), personalized recommendations, meal planning, and shopping list generation.

---

## Value-Added Facilities
- **Personalized Recommendations:** Based on user history/preferences.
- **User-Generated Tags:** Dynamic filtering options.
- **Shopping List Generator:** Based on inventory and meal plans.
- **Dietary & Allergen Filters:** Filters for allergies, diets, religious restrictions.
- **Meal Planning Assistant:** Creates customized meal plans.
- **Bookmarking & Favorites:** Save recipes for future reference.
- **Sharing:** Share recipes and tags on social media.

---

## Application Personas

### Persona 1: Busy Individual
- Search recipes by skill level.
- Search based on ingredients they already have.
- Save and access bookmarked/favorite recipes.
- Search recipes by cook time.
- Search recipes by owned cookware.

### Persona 2: Professional Chef
- Search detailed/advanced recipes.
- Search recipes needing niche cookware.
- Search recipes for rare ingredients.
- Search recipes by cuisine style.
- Add/link their own recipes.

### Persona 3: Food Blogger / Content Creator
- Search trendy food recipes.
- Add links to personal recipes (YouTube, blogs, social media).
- Create a creator profile (with pinned and personalized recipes).
- Use comments/chatting features to interact.
- Possible monetization through sponsorships/partnerships.

### Persona 4: Health Conscious Individual
- Search recipes with specific health benefits.
- Filter out recipes with allergens or undesired ingredients.
- Create and customize meal plans (weight loss, muscle gain, etc.).
- View detailed nutritional information.
- Follow dietitian and health-focused creators.

---

## Real-World Entities
- **Recipes:** Linked to external sources, includes metadata.
- **Tags:** Prep time, cuisine, difficulty, etc.
- **User-Generated Tags:** Community-contributed tags.
- **Users:** General, Registered, Content Creator, Administrator.
- **User Profiles:** Personalization and saved recipes.
- **Ratings and Reviews:** Submitted by users.
- **Ingredients:** Used in recipes.
- **Equipment:** Required cookware.
- **Dietary Restrictions & Allergies:** For filtering.
- **Bookmarks:** Saved recipes.
- **Meal Plans:** Structured recipe collections.
- **Shopping Lists:** Auto-generated ingredient lists.
- **Recipe Creators:** Bloggers, YouTubers, chefs.

---

## Database Design (Summary)

### User Roles
- **General User:** Browse recipes.
- **Registered User:** Bookmark, write reviews.
- **Content Creator:** Add recipes, post content.
- **Administrator:** Moderate content and users.

### Key Database Attributes
- **Recipe:**
    - `recipe_id` (PK)
    - `title`
    - `description`
    - `source_url`
    - `prep_time`, `cook_time`
    - `difficulty`
    - `views_count`, `likes_count`, `shares_count`

- **User:**
    - `user_id` (PK)
    - `email`
    - `name`
    - `user_role`

- **Ingredient:**
    - `ingredient_id` (PK)
    - `name`

- **Equipment:**
    - `equipment_id` (PK)
    - `name`

- **Dietary Restrictions:**
    - `restriction_id` (PK)
    - `name`

- **Bookmarks, Meal Plans, Reviews:**
    - Linking users to recipes.

- **Administrator Actions:**
    - Tracks moderation events.

---

## Frontend Responsibilities

### Feature Categories
- **Search and Filtering:**
    - Search recipes by time, skill, ingredient, cookware, cuisine, dietary restrictions.
- **Profile and Personalization:**
    - Bookmarking recipes, creating meal plans, viewing dietary preferences.
- **Recipe Interaction:**
    - Viewing detailed recipe pages.
    - Rating and reviewing recipes.
    - Viewing nutritional information.
- **Content Creation:**
    - Creators uploading/adding external recipe links.
    - Managing creator profiles and collections.
- **Community Engagement:**
    - Commenting, chatting, sharing.
- **Shopping List:**
    - Auto-generate from selected recipes.

### Suggested Pages/Screens
- Home
- Search Results
- Recipe Detail
- Profile (User/Creator)
- Meal Plan Builder
- Shopping List
- Admin Panel (optional)

### Suggested Components
- Search Bar
- Recipe Card
- Recipe List/Grid
- Filters Panel (Skill, Time, Ingredients, Cookware, Health)
- Bookmark Button
- Rating and Review Section
- Profile Header and Edit Section
- Meal Plan Calendar View
- Shopping List Item

---

## Assumptions
- There is an existing backend providing necessary API endpoints.
- User authentication and authorization are handled separately.
- The front-end will be built with modular and reusable components.
- The app must be responsive (mobile + desktop friendly).

---