<?php
class Branzel_Owl_Block_Slider {
    private static $branzel_content_slider_num = 0;

    public static function render( $attributes, $content = '' ) {
    	self::$branzel_content_slider_num++;

      // TOEVOEGEN: SLIDE TIME, NAVIGATION OPTIONS
    	wp_add_inline_script( 'owl-carousel-js',
        sprintf(
          'jQuery(window).load(function() { jQuery("#branzel-carousel-%d").owlCarousel({ loop:true, margin:10, nav:%d, dots: %d, autoplaySpeed: %d }); });',
          self::$branzel_content_slider_num,
          $attributes[ 'enableNavigation'],
          $attributes[ 'enableIndicators'],
          $attributes[ 'slideTime']
           )
      );

    	return sprintf( '<div class="owl-carousel owl-theme" id="branzel-carousel-%d">%s</div>', self::$branzel_content_slider_num, $content );
    }

    public static function run() {
      register_block_type( 'branzel/block-owlcarousel-slider', array(
        'attributes' => array(
        		'numSlides' => array(
        			'type' => 'number',
        			'default' => 1
        		),
            'slideTime' => array(
        			'type' => 'string',
        			'default' => 1500
            ),
            'enableNavigation' => array(
        			'type' => 'number',
        			'default' => 1
            ),
            'enableIndicators' => array(
        			'type' => 'number',
        			'default' => 1
        		)
        ),
          'render_callback' => array( 'Branzel_Owl_Block_Slider', 'render' ),
      ) );
    }
}
?>
