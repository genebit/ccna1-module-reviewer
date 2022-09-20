# Custom Core UI + Bootstrap CSS Framework

Combining Core UI layout with Bootstrap 5's styles with the ability to easily customize BS5's styles using SASS.

### How to use

* Clone this project from the `build` branch or download it from release.
* Move this repository to your project.
* Include to HTML header tags.

### How to include in the header tags
```html
<!-- Vendors styles -->
<!-- Optional: Must be included if sidebar is needed -->
<link rel="stylesheet" href="../plugins/simplebar/dist/simplebar.css" />

<!-- Main styles -->
<link rel="stylesheet" href="css/bs-coreui.css" />

<!-- Icons: Fontawesome 6 and CoreUI -->
<!-- Optional -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
<link rel="stylesheet" href="../plugins/coreui-comp/icons/css/all.min.css" />

<!-- Jquery -->
<script src="../plugins/jquery/jquery-3.6.0.min.js"></script>

<!-- Core UI Scripts -->
<!-- Optional: If coreui components are to be used -->
<script defer src="../plugins/coreui-comp/coreui/dist/js/coreui.bundle.js"></script>
<script defer src="../plugins/simplebar/dist/simplebar.min.js"></script>
<script defer src="../plugins/coreui-comp/utils/dist/coreui-utils.js"></script>

<!-- Bootstrap 5 scripts -->
<script defer src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

<!-- Main Scripts -->
<!-- This includes the js/components script needed to make sidebar work -->
<script defer src="js/site.js" type="module"></script>
```

### Customizing BS5

##### Prerequisites
* SASS Compiler or just use the watch SASS compiler in VSCode.

Go to `src/scss` and modify `bs-coreui.scss`.
Once you are done with your customization build the sass file to css and minify to `build/`