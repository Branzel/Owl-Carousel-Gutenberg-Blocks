<?php
/**
 * Plugin Name: Branzel Owl Carousel Blocks
 * Plugin URI: https://owlcarousel2.github.io/OwlCarousel2/
 * Description: owl-carousel — is a Gutenberg plugin created via create-guten-block.
 * Author: Branzel
 * Author URI: 
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BRANZEL_OWLCAROUSEL_ABSPATH', plugin_dir_path( __FILE__ ) );
define( 'BRANZEL_OWLCAROUSEL__FILE__', __FILE__ );

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
