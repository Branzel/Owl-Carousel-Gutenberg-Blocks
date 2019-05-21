/**
 * BLOCK: bootstrap-slide
 *
 * Registering a basic Owl Carousel slide for the slider.
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
import { InspectorControls, MediaUpload } from 'wp.editor';
import { PanelBody, Button } from 'wp.components';
import { Component, Fragment } from 'wp.element';
import { registerBlockType } from 'wp.blocks';

registerBlockType( 'branzel-content/block-owlcarousel-slide', {
	title: __( 'Image Slide' ),
	parent: [ 'branzel-content/block-owlcarousel-slider' ],
	icon: 'format-gallery',
	category: 'common',
	attributes: {
		mediaID: {
			type: 'number',
		},
		mediaURL: {
			type: 'string'
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 */
	edit: class extends Component {
		constructor(props) {
			super(...arguments);
			this.props = props;

			this.onSelectImage = this.onSelectImage.bind(this);
		}

		onSelectImage ( media ) {
			return this.props.setAttributes( {
				mediaURL: media.url,
				mediaID: media.id,
			} );
		};

		render() {
			const { className, attributes: {
				mediaID,
				mediaURL
			},
			} = this.props;

			return (
				<Fragment>
					<PanelBody
						title={ __( 'Slide' ) }
						initialOpen={ false }
						icon="format-image"
					>
						<div
							className="toggleContent"
							style={ mediaID && {
								backgroundImage: "url('" + mediaURL + "')"
							} }
						>
							<MediaUpload
								onSelect={ this.onSelectImage }
								type='image'
								value={mediaID}
								render={ ( obj ) => {
									return (
										<Button
											className={ 'button button-large' }
											onClick={ obj.open }
										>
										{ __( 'Upload Image' ) }
										</Button>

									);
								} }
							/>
						</div>
					</PanelBody>
				</Fragment>
			);
		}
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 */
	save( { attributes, className } ) {
		const {
			mediaURL
		} = attributes;

		return (
      <div className={ classnames( "owl-item", { className: className } ) }>
  			<img
          src={ mediaURL }
  			/>
      </div>
		);
	}
} );
