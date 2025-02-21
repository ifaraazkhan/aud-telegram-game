import React, { Fragment } from 'react';
import { Accordion, Button, Modal, OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
import { RcImage } from './RcImage';
import { icons } from '../constants';
import { smartAlert } from '../utils/Helper';

const RcModal = (props) => {
    const { modalType, formSubmit, show, hideModal, modalData, RmSize = "md", RmClass = "", formType = "", mClass } = props

    const handleModalClose = (data = null) => {
        hideModal(data)
    };

    const openLink = (url) => {
        window.open(url, '_blank');
        setTimeout(() => {
            modalData && modalData.getUserRewardsBalance && modalData.getUserRewardsBalance()
            smartAlert({title: "Success", message: "Offer has been claimed",type: 2});
        }, 3000);
    }

    return (
        <>
            {modalType == 'offerwall_modal' &&
                <Modal
                    show={show}
                    onHide={handleModalClose}
                    backdrop="static"
                    keyboard={false}
                    size={RmSize}
                    className={`custom-modal ${RmClass}`}
                    scrollable={true}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    fullscreen={'md-down'}
                >
                    <Modal.Header closeButton className='pt-3 border-0 pb-0'>
                        <Modal.Title className="fs-12"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalData && !modalData.isLoading &&  modalData.offers && modalData.offers.length > 0 && modalData.offers.map((offer, oIndex) => (
                            <Fragment key={oIndex}>
                                <div className='offer_box'>
                                    <div className='offer_box_inner'>
                                        <div className='offer-card d-flex align-items-center justify-content-between'>
                                            <div className='offer_box_inner_left_icon me-3 w_50 h_50'>
                                                <RcImage src={offer.icon} alt="icon" className='img-fluid ' />
                                            </div>
                                            <div className='offer_box_inner_left_text col'>
                                                <h3 className='fs-12 fw-500'>{offer.title}</h3>
                                                <p className='fs-10 mb-0'>{offer.description}</p>
                                            </div>
                                            <div className='coin-badge p-1 d-flex align-items-center link_url' onClick={() => openLink(offer.url)}>
                                                <p className='fs-10 mb-0 d-flex align-items-center justify-content-start ms-2 w-100'>
                                                    <span className='w_coin_icn d-inline-block'><RcImage src={icons.coinIcon} alt="icon" className='img-fluid me-2' /></span>
                                                    <span className='ms-1'>{offer.reward} {offer.currency}</span>
                                                </p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                        {modalData && !modalData.isLoading &&  modalData.offers && modalData.offers.length == 0 && 
                            <Fragment>
                                <p className='text-center fw-500 fs-12'> No offers available.</p>
                            </Fragment>
                        }
                        {modalData && modalData.isLoading && 
                            <Fragment>
                                <p className='text-center'><RcImage src={icons.loaderIcn} alt="loader" className='img-fluid' /></p>
                            </Fragment>
                        }
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default RcModal
