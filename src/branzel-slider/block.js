/**
 * BLOCK: bootstrap-slider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Wordpress dependencies
 */
import { __ } from 'wp.i18n';
import { InspectorControls, InnerBlocks, BlockControls } from 'wp.editor';
import { PanelBody, TextControl, CheckboxControl, Toolbar } from 'wp.components';
import { Component, Fragment } from 'wp.element';
import { registerBlockType } from 'wp.blocks';

/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'core/column'.
 *
 * @constant
 * @type {string[]}
*/
const ALLOWED_BLOCKS = [ 'branzel-content/block-owlcarousel-slide' ];

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getSlidesTemplate = ( numSlides ) => {
	var col = [];

	for ( var i = 0; i < numSlides; i++ ) {
		col.push([ 'branzel-content/block-owlcarousel-slide' ]);
	}
	return col;
};

registerBlockType( 'branzel-content/block-owlcarousel-slider', {
	title: __( 'Mediaslider' ), // Block title.
	icon: 'format-gallery',
	category: 'common',
	supports: {
		anchor: false,
		className: true
	},
	keywords: [
		__( 'image' ),
		__( 'gallery' ),
	],
	attributes: {
		numSlides: {
			type: 'number',
			default: 1
		},
		slideTime: {
			type: 'string',
			default: 1500
		},
		enableNavigation: {
			type: 'number',
			default: 1
		},
		enableIndicators: {
			type: 'number',
			default: 1
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: class extends Component {
		constructor(props) {
			super(...arguments);
			this.props = props;

			this.onSlideTimeChange = this.onSlideTimeChange.bind(this);
			this.onEnableNavigationChange = this.onEnableNavigationChange.bind(this);
			this.onEnableIndicatorsChange = this.onEnableIndicatorsChange.bind(this);
		}

		onSlideTimeChange(slideTime) {
			this.props.setAttributes({slideTime});
		}

		onEnableNavigationChange(enableNavigation) {
			this.props.setAttributes({ enableNavigation });
		}

		onEnableIndicatorsChange(enableIndicators) {
			this.props.setAttributes({ enableIndicators });
		}

		render() {
			const {
				className,
				attributes: {
					slideTime,
					enableNavigation,
					enableIndicators,
					numSlides
				},
			} = this.props;

			return (
				<Fragment>
					<BlockControls>
						<Toolbar
							controls={ [
								{
									icon: 'plus',
									title: __( 'Add Slide' ),
									slideAction: 'add',
									onClick: () => {
										const numSlides = this.props.attributes.numSlides + 1;
										this.props.setAttributes({ numSlides });
									}
								},
								{
									icon: 'minus',
									title: __( 'Remove Last Slide' ),
									slideAction: 'remove',
									onClick: () => {
										const numSlides = this.props.attributes.numSlides - 1;
										this.props.setAttributes({ numSlides });
									}
								},
							] }
						/>
					</BlockControls>
					<InspectorControls>
						<PanelBody title={ __( 'Slider Settings' ) } className="blocks-bootstrap-slider-settings">
							<TextControl
								label={ __( "Slide Time" ) }
								value={slideTime}
								help={ __( "Time to show each slide (ms). Or write 'false' if the slider should loop automatically." ) }
								onChange={ this.onSlideTimeChange }
							/>
							<CheckboxControl
								heading={ __( "Show Slider Navigation?" ) }
								label={ __( "Show" ) }
								help={ __( "Show the navigation arrows left and right?" ) }
								checked={ enableNavigation }
								onChange={ this.onEnableNavigationChange }
							/>
							<CheckboxControl
								heading={ __( "Show Hero Slider Indicators?" ) }
								label={ __( "Show" ) }
								help={ __( "The indicators are the small lines in the lower center." ) }
								checked={ enableIndicators }
								onChange={ this.onEnableIndicatorsChange }
							/>
						</PanelBody>
					</InspectorControls>
					<div className={ ( className ? " " + className : '' ) }>
						<InnerBlocks
							template={ getSlidesTemplate( numSlides ) }
							templateLock="all"
							allowedBlocks={ ALLOWED_BLOCKS } />
					</div>
				</Fragment>
			);
		}
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 */
   save: function( props ) {
     return (
       <Fragment>
         <InnerBlocks.Content />
       </Fragment>
     );
   },
} );
