# Custom Category

To create a custom summarization prompt:

1. Start on the **Home** page.
2. Scroll down to the **Email Categories** tile.
3. Click Configure.
4. Click **New Category**.

<video controls muted loop playsinline width="75%" poster="../assets/images/create-category-poster.png">
  <source src="../assets/videos/create-category.mp4" type="video/mp4">
</video>

## Matching Keys

Matching rules use case-insensitive exact matching:

* The **From** rule must match the entire sender address. 
* The **Subject** rule must match the entire subject.

You can match against more than one email and more than one subject. Note that you can't enter emails as a list. For multiple emails, use the **+Add** button. Likewise for subject.

Rules are checked in the order submitted: each email is checked, and then each subject. The first one to match determines the category. If none matches, default categorization is used.