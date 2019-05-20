/**
 * BLOCK: bootstrap-slider
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component, Fragment } = wp.element;
const { InspectorControls, MediaUpload, RichText } = wp.editor;
const { Panel, PanelBody, Button, TextControl, CheckboxControl, BaseControl, ColorPalette, SelectControl } = wp.components;

const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const hexToRgbA = (hex, alpha) => {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+","+alpha+')';
    }

	return 'rgba(0,0,0,' + alpha + ')';
}

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'branzel/block-owlcarousel-slide', {
	title: __( 'Image Slide' ), // Block title.
	parent: [ 'branzel/block-owlcarousel-slider' ],
	icon: 'format-gallery',
	category: 'common',
	keywords: [
		__( 'image' ),
		__( 'gallery' ),
	],
	attributes: {
		mediaID: {
			type: 'number',
		},
		mediaURL: {
			type: 'string'
		},
		mediaPosition: {
			type: 'string',
			default: 'center'
		},
		slideTitle: {
			type: 'string',
			source: 'children',
			selector: 'h1'
		},
		leadContent: {
			type: 'string',
			source: 'children',
			selector: 'p.lead'
		},
		content: {
			type: 'string',
			source: 'children',
			selector: 'p.otherContent'
		},
		linkURL: {
			type: 'url',
			default:'#',
			source: 'attribute',
			selector: 'a.btn',
			attribute: 'href'
		},
		linkTitle: {
			type: 'string',
		},
		linkTarget: {
			type: 'string',
			default:'_self',
			source: 'attribute',
			selector: 'a.btn',
			attribute: 'target'
		},
		slideHeight: {
			type: 'number',
			default: 450
		},
		enableCaption: {
			type: 'number',
			default: 1
		},
		captionBackgroundColor: {
			type: 'string',
			default: "#ffffff"
		},
		captionBackgroundOpacity: {
			type: 'number',
			default: 0.6
		},
		captionTitleColor: {
			type: 'string',
			default: "#000000"
		},
		captionTextColor: {
			type: 'string',
			default: "#000000"
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
			this.state = {
				isHidden: true
			}

			this.onSelectImage = this.onSelectImage.bind(this);
			this.onSlideHeightChange = this.onSlideHeightChange.bind(this);
		}

		toggleHidden () {
			this.setState({
				isHidden: !this.state.isHidden
			})
		}

		onSlideHeightChange(slideHeight) {
			this.props.setAttributes({ slideHeight });
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
				mediaURL,
				mediaPosition,
				slideTitle,
				leadContent,
				content,
				linkURL,
				linkTitle,
				linkTarget,
				slideHeight,
				captionBackgroundOpacity,
				captionBackgroundColor,
				captionTitleColor,
				captionTextColor,
				enableCaption
			},
			} = this.props;

			return (
				<Fragment>
					<InspectorControls>
						<PanelBody title={ __( 'Slide Settings' ) }>
							<TextControl
								label={ __( "Slide height (px)" ) }
								value={slideHeight}
								type="number"
								help={ __( "Height in px of the slider. Default: 450" ) }
								onChange={ this.onSlideHeightChange }
							/>
							<CheckboxControl
								heading={ __( "Enable caption?" ) }
								label={ __( "Enable" ) }
								help={ __( "" ) }
								checked={ enableCaption }
								onChange={(checked) => this.props.setAttributes({ enableCaption: checked })}
							/>
						</PanelBody>
						<PanelBody title={ __( 'Image Settings' ) } initialOpen={ false }>
							<SelectControl
								label="Image position"
								value={ mediaPosition }
								options={ [
									{ label: 'Top', value: 'top' },
									{ label: 'Center', value: 'center' },
									{ label: 'Bottom', value: 'bottom' },
								] }
								onChange={ (mediaPosition) => this.props.setAttributes( { mediaPosition } ) }
							/>
						</PanelBody>
						{ enableCaption && <PanelBody title={ __( 'Caption Settings' ) } initialOpen={ false }>
							<BaseControl
								label={ __( "Caption Title Color" ) }
								>
								<ColorPalette
									value={captionTitleColor}
									onChange={(captionTitleColor) => this.props.setAttributes({ captionTitleColor })} />
							</BaseControl>
							<BaseControl
								label={ __( "Caption Text Color" ) }
								>
								<ColorPalette
									value={captionTextColor}
									onChange={(captionTextColor) => this.props.setAttributes({ captionTextColor })} />
							</BaseControl>
							<BaseControl
								label={ __( "Caption Background Color" ) }
								>
								<ColorPalette
									value={captionBackgroundColor}
									onChange={(captionBackgroundColor) => this.props.setAttributes({ captionBackgroundColor })} />
							</BaseControl>
							<TextControl
								label={ __( "Caption Background Opacity" ) }
								value={captionBackgroundOpacity}
								type="number"
								help={ __( "A value between 0 and 1 to dissolve the background color." ) }
								onChange={(captionBackgroundOpacity) => this.props.setAttributes({ captionBackgroundOpacity })}
							/>
							<TextControl
								type='url'
								label={ __( "Link URL" ) }
								value={linkURL}
								onChange={(linkURL) => this.props.setAttributes({ linkURL })}
							/>
							<CheckboxControl
								heading={ __( "" ) }
								label={ __( "Open link in new tab?" ) }
								help={ __( "" ) }
								checked={ ( linkTarget === "_blanc" ) }
								onChange={(checked) => this.props.setAttributes({ linkTarget: ( checked ? '_blanc' : '_self' )  })}
							/>
						</PanelBody>
						}
					</InspectorControls>
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
								{ enableCaption && <div className="carousel-caption-e"
								style={ {
									backgroundColor: hexToRgbA ( captionBackgroundColor, captionBackgroundOpacity),
								} }
								>
									<RichText
										tagName='h1'
										value={ slideTitle }
										placeholder="Slide Title"
										onChange={ ( slideTitle ) => {
											this.props.setAttributes( { slideTitle } );
										} }
										style={ {
											color: captionTitleColor
										} }
									/>
									<RichText
										tagName='p'
										value={ leadContent }
										className="lead"
										placeholder="Slide Lead Paragraph"
										onChange={ ( leadContent ) => {
											this.props.setAttributes( { leadContent } );
										} }
										style={ {
											color: captionTextColor
										} }
									/>
									<RichText
										tagName='p'
										className="otherContent"
										placeholder="Slide Paragraph"
										value={ content }
										onChange={ ( content ) => {
											this.props.setAttributes( { content } );
										} }
										style={ {
											color: captionTextColor
										} }
									/>
									<a
										className="btn btn-primary btn-lg"
										>
										<RichText
											tagName='span'
											placeholder="Slide Button Text (Other opthions in inspector)"
											value={ linkTitle }
											onChange={ ( linkTitle ) => {
												this.props.setAttributes( { linkTitle } );
											}}
										/>
									</a>
								</div> }
							</div>
						</PanelBody>
				</Fragment>
			);
		}
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save( { attributes, className } ) {
		const {
			mediaID,
			mediaURL,
			mediaPosition,
			slideTitle,
			leadContent,
			content,
			linkURL,
			linkTitle,
			linkTarget,
			slideHeight,
			captionBackgroundOpacity,
			captionBackgroundColor,
			captionTitleColor,
			captionTextColor,
			enableCaption
		} = attributes;

		return (
			<div className={ "owl-item" + ( className ? " " + className : '' ) }
				style={ {
					backgroundImage: ( mediaURL ? "url('" + mediaURL + "')" : "none" ),
					backgroundPosition: "center " + mediaPosition,
					minHeight: slideHeight + "px",
				} }
			>
				{ enableCaption && <div className="carousel-caption d-block d-md-block"
					style={ {
						backgroundColor: hexToRgbA ( captionBackgroundColor, captionBackgroundOpacity),
						display: ( ( slideTitle == '' && leadContent == '' && content == '' && linkTitle == '' ) ? "none" : "block" )
					} }
					>
					<RichText.Content
						tagName='h1'
						value={ slideTitle }
						className="display-4"
						style={ {
							color: captionTitleColor
						} }
					/>
					<RichText.Content
						tagName='p'
						value={ leadContent }
						className="lead"
						style={ {
							color: captionTextColor
						} }
					/>
					<RichText.Content
						tagName='p'
						className="otherContent"
						value={ content }
						style={ {
							color: captionTextColor
						} }
					/>
					{ !linkTitle ? '' :
						<a
							className="btn btn-primary btn-lg"
							target={ linkTarget }
							href={ linkURL }
						>
							<RichText.Content
								tagName='span'
								value={ linkTitle }
							/>
						</a>
					}
				</div>
				}
			</div>
		);
	}
} );
